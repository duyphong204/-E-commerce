import { CartRepository } from "./cart.repository";
import { ProductRepository } from "../product/product.repository";
import { AddCartItemInput, UpdateCartItemInput, RemoveCartItemInput, MergeCartInput } from "./cart.schema";
import { NotFoundException, BadRequestException } from "../../common/exceptions/HttpException";

export class CartService {
  private cartRepository: CartRepository;
  private productRepository: ProductRepository;

  constructor() {
    this.cartRepository = new CartRepository();
    this.productRepository = new ProductRepository();
  }

  private async getCartByUserIdOrGuestId(userId?: string, guestId?: string) {
    if (userId) {
      return this.cartRepository.findByUserId(userId);
    } else if (guestId) {
      return this.cartRepository.findByGuestId(guestId);
    }
    return null;
  }

  async getCart(userId?: string, guestId?: string) {
    const cart = await this.getCartByUserIdOrGuestId(userId, guestId);
    if (!cart) {
      throw new NotFoundException("Cart not found");
    }
    return cart;
  }

  async addToCart(data: AddCartItemInput) {
    const { productId, quantity, size, color, guestId, userId } = data;
    const product = await this.productRepository.findById(productId) as any;

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    let cart = await this.getCartByUserIdOrGuestId(userId, guestId);

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

      // Recalculate total price
      cart.totalPrice = cart.products.reduce(
        (total: number, item: any) => total + item.price * item.quantity,
        0
      );

      await cart.save();
      return cart;
    } else {
      const newCart = await this.cartRepository.create({
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
      });

      return newCart;
    }
  }

  async updateCartItem(data: UpdateCartItemInput) {
    const { productId, quantity, size, color, guestId, userId } = data;
    const cart = await this.getCartByUserIdOrGuestId(userId, guestId);
    if (!cart) {
      throw new NotFoundException("Cart not found");
    }

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

      await cart.save();
      return cart;
    } else {
      throw new NotFoundException("Product not found in cart");
    }
  }

  async removeCartItem(data: RemoveCartItemInput) {
    const { productId, size, color, guestId, userId } = data;
    const cart = await this.getCartByUserIdOrGuestId(userId, guestId);
    if (!cart) {
      throw new NotFoundException("Cart not found");
    }

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

      await cart.save();
      return cart;
    } else {
      throw new NotFoundException("Product not found in cart");
    }
  }

  async mergeGuestCart(guestId: string, loggedInUserId: string) {
    const guestCart = await this.cartRepository.findByGuestId(guestId);
    const userCart = await this.cartRepository.findByUserId(loggedInUserId);

    if (!guestCart) {
      if (userCart) {
        return userCart;
      }
      throw new NotFoundException("Guest cart not found");
    }

    if (guestCart.products.length === 0) {
      throw new BadRequestException("Guest cart is empty");
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

      await userCart.save();

      // Clean up the guest cart
      try {
        await this.cartRepository.deleteByGuestId(guestId);
      } catch (err) {
        console.error("Error deleting guest cart:", err);
      }

      return userCart;
    } else {
      // Set guest cart user
      guestCart.user = loggedInUserId as any;
      guestCart.guestId = undefined;

      await guestCart.save();
      return guestCart;
    }
  }
}
