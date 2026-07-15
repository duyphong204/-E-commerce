import { ReviewRepository } from "./review.repository";
import { ProductRepository } from "../product/product.repository";
import { CreateReviewInput } from "./review.schema";
import { NotFoundException, BadRequestException, UnauthorizedException } from "../../common/exceptions/HttpException";

export class ReviewService {
  private reviewRepository: ReviewRepository;
  private productRepository: ProductRepository;

  constructor() {
    this.reviewRepository = new ReviewRepository();
    this.productRepository = new ProductRepository();
  }

  private async updateProductRating(productId: string) {
    const reviews = await this.reviewRepository.findByProduct(productId);
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        : 0;

    await this.productRepository.update(productId, {
      rating: avgRating,
      numReviews: reviews.length,
    });
  }

  async createReview(productId: string, userId: string, data: CreateReviewInput) {
    const product = await this.productRepository.findById(productId) as any;
    if (!product) {
      throw new NotFoundException("Product not found");
    }

    const hasPurchased = await this.reviewRepository.checkUserPurchased(userId, productId);
    if (!hasPurchased) {
      throw new BadRequestException("Bạn chỉ có thể đánh giá sản phẩm đã nhận hàng!");
    }

    const existing = await this.reviewRepository.checkExistingReview(userId, productId);
    if (existing) {
      throw new BadRequestException("Bạn chỉ được đánh giá 1 lần");
    }

    const review = await this.reviewRepository.create({
      user: userId,
      product: productId,
      rating: data.rating,
      comment: data.comment,
    });

    product.reviews.push((review as any)._id);
    await product.save();

    await this.updateProductRating(productId);

    return this.reviewRepository.findPopulatedById((review as any)._id.toString());
  }

  async getReviewsByProduct(productId: string) {
    const reviews = await this.reviewRepository.findReviewsPopulated(productId);
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.length
        : 0;

    return { reviews, avgRating };
  }

  async deleteReview(id: string, userId: string) {
    const review = await this.reviewRepository.findById(id);
    if (!review) {
      throw new NotFoundException("Review not found");
    }

    if (review.user.toString() !== userId.toString()) {
      throw new UnauthorizedException("Not authorized");
    }

    await review.deleteOne();
    await this.updateProductRating(review.product.toString());

    return { message: "Review deleted" };
  }
}
