import mongoose from "mongoose";
import Coupon, { ICoupon } from "../../models/Coupon";
import CouponUsage from "../../models/CouponUsage";
import { BadRequestException, NotFoundException } from "../exceptions/HttpException";

export const normalizeCode = (code = ""): string => code.trim().toUpperCase();

export interface ValidateCouponOptions {
  couponId?: string;
  couponCode?: string;
  userId: string;
  orderTotal: number;
  session?: any;
}

export const findCoupon = async ({
  couponId,
  couponCode,
  session,
}: {
  couponId?: string;
  couponCode?: string;
  session?: any;
}): Promise<ICoupon> => {
  if (couponId && !mongoose.Types.ObjectId.isValid(couponId)) {
    throw new BadRequestException("Mã coupon không hợp lệ");
  }

  const query = couponId
    ? { _id: couponId }
    : couponCode
    ? { code: normalizeCode(couponCode) }
    : null;

  if (!query) {
    throw new BadRequestException("Thiếu thông tin mã giảm giá");
  }

  const coupon = await Coupon.findOne(query).session(session || null);
  if (!coupon) {
    throw new NotFoundException("Mã giảm giá không tồn tại");
  }
  return coupon;
};

export const ensureCouponActive = (coupon: ICoupon): void => {
  const now = new Date();
  if (!coupon.isActive || now < coupon.startDate || now > coupon.endDate) {
    throw new BadRequestException("Mã giảm giá không hợp lệ hoặc đã hết hạn");
  }
};

export const ensureUsageLimits = async ({
  coupon,
  userId,
  session,
}: {
  coupon: ICoupon;
  userId: string;
  session?: any;
}): Promise<void> => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new BadRequestException("UserId không hợp lệ");
  }

  const userUsage = await CouponUsage.findOne({
    user: userId,
    coupon: coupon._id,
  }).session(session || null);

  if (userUsage) {
    throw new BadRequestException("Bạn đã sử dụng mã này rồi");
  }

  if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
    throw new BadRequestException("Mã giảm giá đã đạt số lượt sử dụng tối đa");
  }
};

export const ensureOrderValue = (coupon: ICoupon, orderTotal: number): void => {
  if (
    typeof orderTotal !== "number" ||
    Number.isNaN(orderTotal) ||
    orderTotal <= 0
  ) {
    throw new BadRequestException("Tổng giá trị đơn không hợp lệ");
  }

  if (coupon.minOrderValue && orderTotal < coupon.minOrderValue) {
    throw new BadRequestException(
      `Đơn hàng phải từ ${coupon.minOrderValue.toLocaleString()}₫ trở lên`
    );
  }
};

export const computeDiscount = (coupon: ICoupon, orderTotal: number): number => {
  const value = Number(coupon.discountValue) || 0;
  if (value <= 0) {
    throw new BadRequestException("Mã giảm giá không hợp lệ");
  }

  let discountAmount = 0;

  if (coupon.discountType === "percent") {
    discountAmount = (orderTotal * value) / 100;
    if (coupon.maxDiscountValue) {
      const max = Number(coupon.maxDiscountValue) || 0;
      discountAmount = Math.min(discountAmount, max);
    }
  } else {
    discountAmount = value;
  }

  return Math.min(discountAmount, orderTotal);
};

export const validateCouponForUser = async ({
  couponId,
  couponCode,
  userId,
  orderTotal,
  session,
}: ValidateCouponOptions): Promise<{ coupon: ICoupon; discountAmount: number }> => {
  const coupon = await findCoupon({ couponId, couponCode, session });
  ensureCouponActive(coupon);
  await ensureUsageLimits({ coupon, userId, session });
  ensureOrderValue(coupon, orderTotal);

  const discountAmount = computeDiscount(coupon, orderTotal);

  return { coupon, discountAmount };
};
