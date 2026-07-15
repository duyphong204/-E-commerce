import { WishlistRepository } from "./wishlist.repository";
import { ProductRepository } from "../product/product.repository";
import { NotFoundException } from "../../common/exceptions/HttpException";

export class WishlistService {
  private wishlistRepository: WishlistRepository;
  private productRepository: ProductRepository;

  constructor() {
    this.wishlistRepository = new WishlistRepository();
    this.productRepository = new ProductRepository();
  }

  async getWishlist(userId: string) {
    const user = await this.wishlistRepository.getWishlist(userId);
    if (!user) {
      throw new NotFoundException("User Not Found !");
    }
    return this.formatWishlist(user.wishlist);
  }

  async addToWishlist(userId: string, productId: string) {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new NotFoundException("Product Not Found !");
    }

    const user = await this.wishlistRepository.addToWishlist(userId, productId);
    if (!user) {
      throw new NotFoundException("User Not Found !");
    }

    return this.formatWishlist(user.wishlist);
  }

  async removeFromWishlist(userId: string, productId: string) {
    const user = await this.wishlistRepository.removeFromWishlist(userId, productId);
    if (!user) {
      throw new NotFoundException("User Not Found !");
    }
    return this.formatWishlist(user.wishlist);
  }

  private formatWishlist(wishlistItems: any[]) {
    return wishlistItems.map((item: any) => ({
      _id: item._id,
      name: item.name,
      price: item.price,
      image: item.images && item.images.length > 0 ? item.images[0].url : null,
    }));
  }
}
