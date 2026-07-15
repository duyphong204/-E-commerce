import { Router } from "express";
import { CouponController } from "./coupon.controller";
import { protect, admin } from "../../common/middlewares/auth.middleware";
import { validateRequest } from "../../common/middlewares/validation.middleware";
import { createCouponSchema, updateCouponSchema } from "./coupon.schema";

const router = Router();
const couponController = new CouponController();

router.use(protect as any, admin as any);

router.get("/coupons", couponController.getAllCoupons);
router.post("/coupons", validateRequest(createCouponSchema), couponController.createCoupon);
router.put("/coupons/:id", validateRequest(updateCouponSchema), couponController.updateCoupon);
router.patch("/coupons/:id/toggle", couponController.toggleCouponStatus);
router.delete("/coupons/:id", couponController.deleteCoupon);

export default router;
