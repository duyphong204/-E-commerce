import User from "../../models/User";

export class WishlistRepository {
  async getWishlist(userId: string) {
    return User.findById(userId).populate({
      path: "wishlist",
      select: "_id name price images.url",
    });
  }

  async addToWishlist(userId: string, productId: string) {
    return User.findByIdAndUpdate(
      userId,
      { $addToSet: { wishlist: productId } },
      { new: true }
    ).populate({
      path: "wishlist",
      select: "_id name price images.url",
    });
  }

  async removeFromWishlist(userId: string, productId: string) {
    return User.findByIdAndUpdate(
      userId,
      { $pull: { wishlist: productId } },
      { new: true }
    ).populate({
      path: "wishlist",
      select: "_id name price images.url",
    });
  }
}
