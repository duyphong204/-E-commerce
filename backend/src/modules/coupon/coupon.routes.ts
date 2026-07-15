import { Router } from "express";
import { CouponController } from "./coupon.controller";
import { protect } from "../../common/middlewares/auth.middleware";
import { validateRequest } from "../../common/middlewares/validation.middleware";
import { validateCouponSchema, applyCouponSchema } from "./coupon.schema";

const router = Router();
const couponController = new CouponController();

// ----------------------
// User routes (Protected)
// ----------------------
router.post("/validate", protect as any, validateRequest(validateCouponSchema), couponController.validateCoupon);
router.post("/apply", protect as any, validateRequest(applyCouponSchema), couponController.applyCoupon);

export default router;

