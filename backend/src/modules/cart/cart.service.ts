import { CartRepository } from "./cart.repository";
import { ProductRepository } from "../product/product.repository";
import { AddCartItemInput, UpdateCartItemInput, RemoveCartItemInput, MergeCartInput } from "./cart.schema";
import { NotFoundException, BadRequestException } from "../../common/exceptions/HttpException";
import redisClient from "../../config/redis";

const CART_TTL = 7 * 24 * 3600; // 7 days

export class CartService {
  private cartRepository: CartRepository;
  private productRepository: ProductRepository;

  constructor() {
    this.cartRepository = new CartRepository();
    this.productRepository = new ProductRepository();
  }

  private getCacheKey(userId?: string, guestId?: string): string {
    return `cart:${userId || guestId}`;
  }

  // Fetch cart (Redis first -> DB fallback)
  private async getCartData(userId?: string, guestId?: string) {
    const key = this.getCacheKey(userId, guestId);
    
    if (redisClient.isReady) {
      try {
        const cached = await redisClient.get(key);
        if (cached) return JSON.parse(cached);
      } catch (err) {
        console.error("[Redis] Lỗi đọc giỏ hàng:", err);
      }
    }

    // Fallback to DB
    let cartDoc = null;
    if (userId) {
      cartDoc = await this.cartRepository.findByUserId(userId);
    } else if (guestId) {
      cartDoc = await this.cartRepository.findByGuestId(guestId);
    }

    const cartObj = cartDoc ? cartDoc.toObject() : null;

    // Cache to Redis
    if (cartObj && redisClient.isReady) {
      redisClient.setEx(key, CART_TTL, JSON.stringify(cartObj)).catch(() => {});
    }

    return cartObj;
  }

  // Save cart (Redis first -> Async DB sync)
  private async saveCartData(cartObj: any, userId?: string, guestId?: string) {
    const key = this.getCacheKey(userId, guestId);

    // Sync to DB (Write-behind)
    const syncDb = async () => {
      try {
        if (cartObj._id) {
          await this.cartRepository.updateById(cartObj._id, cartObj);
        } else {
          const newCart = await this.cartRepository.create(cartObj);
          cartObj._id = newCart._id;
        }
      } catch (err) {
        console.error("[Cart DB Sync] Lỗi lưu DB:", err);
      }
    };

    if (redisClient.isReady) {
      // 1. Sync to DB if new cart to get _id
      if (!cartObj._id) await syncDb();
      else syncDb().catch(() => {}); // Fire and forget for existing
      
      // 2. Save to Redis
      await redisClient.setEx(key, CART_TTL, JSON.stringify(cartObj));
      return cartObj;
    } else {
      // Fallback: synchronous save
      await syncDb();
      return cartObj;
    }
  }

  async getCart(userId?: string, guestId?: string) {
    const cart = await this.getCartData(userId, guestId);
    if (!cart) {
      throw new NotFoundException("Giỏ hàng không tồn tại");
    }
    return cart;
  }

  async addToCart(data: AddCartItemInput) {
    const { productId, quantity, size, color, guestId, userId } = data;
    const product = await this.productRepository.findById(productId) as any;

    if (!product) {
      throw new NotFoundException("Không tìm thấy sản phẩm");
    }

    let cart = await this.getCartData(userId, guestId);

    if (cart) {
      const existingProductIdx = cart.products.findIndex(
        (p: any) =>
          p.productId.toString() === product._id.toString() &&
          p.size === size &&
          p.color === color
      );

      if (existingProductIdx > -1) {
        cart.products[existingProductIdx].quantity += Number(quantity);
      } else {
        cart.products.push({
          productId: product._id,
          name: product.name,
          image: product.images[0]?.url || "",
          price: Number(product.price),
          size,
          color,
          quantity: Number(quantity),
        });
      }

      cart.totalPrice = cart.products.reduce(
        (total: number, item: any) => total + item.price * item.quantity,
        0
      );

      return this.saveCartData(cart, userId, guestId);
    } else {
      const newCartObj = {
        user: userId || undefined,
        guestId: guestId || "guest_" + new Date().getTime(),
        products: [
          {
            productId: product._id,
            name: product.name,
            image: product.images[0]?.url || "",
            price: Number(product.price),
            size,
            color,
            quantity: Number(quantity),
          },
        ],
        totalPrice: Number(product.price) * Number(quantity),
      };

      return this.saveCartData(newCartObj, userId, guestId);
    }
  }

  async updateCartItem(data: UpdateCartItemInput) {
    const { productId, quantity, size, color, guestId, userId } = data;
    const cart = await this.getCartData(userId, guestId);
    
    if (!cart) throw new NotFoundException("Giỏ hàng không tồn tại");

    const existingProductIdx = cart.products.findIndex(
      (p: any) =>
        p.productId.toString() === productId.toString() &&
        p.size === size &&
        p.color === color
    );

    if (existingProductIdx > -1) {
      if (quantity > 0) {
        cart.products[existingProductIdx].quantity = quantity;
      } else {
        cart.products.splice(existingProductIdx, 1);
      }

      cart.totalPrice = cart.products.reduce(
        (total: number, item: any) => total + item.price * item.quantity,
        0
      );

      return this.saveCartData(cart, userId, guestId);
    } else {
      throw new NotFoundException("Sản phẩm không có trong giỏ");
    }
  }

  async removeCartItem(data: RemoveCartItemInput) {
    const { productId, size, color, guestId, userId } = data;
    const cart = await this.getCartData(userId, guestId);
    
    if (!cart) throw new NotFoundException("Giỏ hàng không tồn tại");

    const productIdx = cart.products.findIndex(
      (p: any) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    );

    if (productIdx > -1) {
      cart.products.splice(productIdx, 1);

      cart.totalPrice = cart.products.reduce(
        (total: number, item: any) => total + Number(item.price) * Number(item.quantity),
        0
      );

      return this.saveCartData(cart, userId, guestId);
    } else {
      throw new NotFoundException("Sản phẩm không có trong giỏ");
    }
  }

  async mergeGuestCart(guestId: string, loggedInUserId: string) {
    const guestCart = await this.getCartData(undefined, guestId);
    const userCart = await this.getCartData(loggedInUserId, undefined);

    if (!guestCart) {
      if (userCart) return userCart;
      throw new NotFoundException("Giỏ hàng khách không tồn tại");
    }

    if (guestCart.products.length === 0) {
      throw new BadRequestException("Giỏ hàng khách trống");
    }

    if (userCart) {
      // Merge guest cart items into user cart
      guestCart.products.forEach((guestItem: any) => {
        const productIdx = userCart.products.findIndex(
          (userItem: any) =>
            userItem.productId.toString() === guestItem.productId.toString() &&
            userItem.size === guestItem.size &&
            userItem.color === guestItem.color
        );

        if (productIdx > -1) {
          userCart.products[productIdx].quantity += guestItem.quantity;
        } else {
          userCart.products.push(guestItem);
        }
      });

      userCart.totalPrice = userCart.products.reduce(
        (total: number, item: any) => total + Number(item.price) * Number(item.quantity),
        0
      );

      // Save user cart
      await this.saveCartData(userCart, loggedInUserId, undefined);

      // Clean up the guest cart
      try {
        if (redisClient.isReady) {
          await redisClient.del(this.getCacheKey(undefined, guestId));
        }
        await this.cartRepository.deleteByGuestId(guestId);
      } catch (err) {
        console.error("Error deleting guest cart:", err);
      }

      return userCart;
    } else {
      // Set guest cart user
      guestCart.user = loggedInUserId as any;
      guestCart.guestId = undefined;

      // Xóa cache cũ của guest
      if (redisClient.isReady) {
        await redisClient.del(this.getCacheKey(undefined, guestId));
      }

      return this.saveCartData(guestCart, loggedInUserId, undefined);
    }
  }
}
