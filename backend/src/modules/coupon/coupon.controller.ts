import { Request, Response } from "express";
import { CouponService } from "./coupon.service";
import { catchAsync } from "../../common/utils/catchAsync";
import { AuthenticatedRequest } from "../../common/middlewares/auth.middleware";

export class CouponController {
  private couponService: CouponService;

  constructor() {
    this.couponService = new CouponService();
  }

  validateCoupon = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const { code, userId, totalPrice } = req.body;
    const { coupon, discountAmount } = await this.couponService.validateCouponForUser(
      code,
      userId,
      Number(totalPrice)
    );

    return res.json({
      couponId: coupon._id,
      code: coupon.code,
      discountAmount,
      finalTotal: Number(totalPrice) - discountAmount,
      message: "Mã hợp lệ",
    });
  });

  applyCoupon = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const { couponId, userId, orderId } = req.body;
    const result = await this.couponService.applyCoupon(couponId, userId, orderId);
    return res.json(result);
  });

  // Admin Methods
  getAllCoupons = catchAsync(async (req: Request, res: Response) => {
    const result = await this.couponService.getAllCoupons();
    return res.json(result);
  });

  createCoupon = catchAsync(async (req: Request, res: Response) => {
    const coupon = await this.couponService.createCoupon(req.body);
    return res.status(201).json(coupon);
  });

  updateCoupon = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const coupon = await this.couponService.updateCoupon(id, req.body);
    return res.json(coupon);
  });

  toggleCouponStatus = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const coupon = await this.couponService.toggleCouponStatus(id);
    return res.json(coupon);
  });

  deleteCoupon = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await this.couponService.deleteCoupon(id);
    return res.json(result);
  });
}
