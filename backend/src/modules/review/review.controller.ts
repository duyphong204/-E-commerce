import { Request, Response } from "express";
import { ReviewService } from "./review.service";
import { catchAsync } from "../../common/utils/catchAsync";
import { AuthenticatedRequest } from "../../common/middlewares/auth.middleware";

export class ReviewController {
  private reviewService: ReviewService;

  constructor() {
    this.reviewService = new ReviewService();
  }

  createReview = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user._id || req.user.id;
    const productId = req.params.productId as string;
    const review = await this.reviewService.createReview(productId, userId, req.body);
    return res.status(201).json({ message: "Đánh giá thành công", review });
  });

  getReviewsByProduct = catchAsync(async (req: Request, res: Response) => {
    const productId = req.params.productId as string;
    const data = await this.reviewService.getReviewsByProduct(productId);
    return res.status(200).json(data);
  });

  deleteReview = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user._id || req.user.id;
    const id = req.params.id as string;
    const result = await this.reviewService.deleteReview(id, userId);
    return res.status(200).json(result);
  });
}
