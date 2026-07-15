import Review from "../../models/Review";
import Product from "../../models/Product";
import Order from "../../models/Order";

export class ReviewRepository {
  async findById(id: string) {
    return Review.findById(id);
  }

  async findByProduct(productId: string) {
    return Review.find({ product: productId }).lean();
  }

  async findReviewsPopulated(productId: string) {
    return Review.find({ product: productId })
      .populate("user", "name")
      .sort({ createdAt: -1 as any })
      .lean();
  }

  async create(reviewData: any) {
    return Review.create(reviewData);
  }

  async delete(id: string) {
    return Review.findByIdAndDelete(id);
  }

  async checkUserPurchased(userId: string, productId: string) {
    return Order.findOne({
      user: userId,
      "orderItems.productId": productId,
      isDelivered: true,
    });
  }

  async checkExistingReview(userId: string, productId: string) {
    return Review.findOne({ user: userId, product: productId });
  }

  async findPopulatedById(id: string) {
    return Review.findById(id).populate("user", "name");
  }
}
