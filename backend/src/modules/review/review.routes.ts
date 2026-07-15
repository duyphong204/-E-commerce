import { Router } from "express";
import { ReviewController } from "./review.controller";
import { protect } from "../../common/middlewares/auth.middleware";
import { validateRequest } from "../../common/middlewares/validation.middleware";
import { createReviewSchema, getReviewsSchema, deleteReviewSchema } from "./review.schema";

const router = Router();
const reviewController = new ReviewController();

// Public routes
router.get("/:productId", validateRequest(getReviewsSchema), reviewController.getReviewsByProduct);

// Protected routes
router.post("/:productId/create", protect as any, validateRequest(createReviewSchema), reviewController.createReview);
router.delete("/:id", protect as any, validateRequest(deleteReviewSchema), reviewController.deleteReview);

export default router;
