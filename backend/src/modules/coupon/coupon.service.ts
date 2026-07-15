import { CouponRepository } from "./coupon.repository";
import { CreateCouponInput, UpdateCouponInput } from "./coupon.schema";
import { BadRequestException, NotFoundException, UnauthorizedException } from "../../common/exceptions/HttpException";

export class CouponService {
  private couponRepository: CouponRepository;

  constructor() {
    this.couponRepository = new CouponRepository();
  }

  // Business logic methods
  async validateCouponForUser(code: string, userId: string, orderTotal: number) {
    const normalizedCode = code.trim().toUpperCase();
    const coupon = await this.couponRepository.findByCode(normalizedCode);
    if (!coupon) {
      throw new NotFoundException("Mã giảm giá không tồn tại");
    }

    const now = new Date();
    if (!coupon.isActive || now < coupon.startDate || now > coupon.endDate) {
      throw new BadRequestException("Mã giảm giá không hợp lệ hoặc đã hết hạn");
    }

    const userUsage = await this.couponRepository.getUsage(userId, (coupon as any)._id.toString());
    if (userUsage) {
      throw new BadRequestException("Bạn đã sử dụng mã này rồi");
    }

    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
      throw new BadRequestException("Mã giảm giá đã đạt số lượt sử dụng tối đa");
    }

    if (coupon.minOrderValue && orderTotal < coupon.minOrderValue) {
      throw new BadRequestException(`Đơn hàng phải từ ${coupon.minOrderValue.toLocaleString()}₫ trở lên`);
    }

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

    const finalDiscount = Math.min(discountAmount, orderTotal);

    return {
      coupon,
      discountAmount: finalDiscount,
    };
  }

  async applyCoupon(couponId: string, userId: string, orderId: string) {
    const order = await this.couponRepository.getOrderById(orderId);
    if (!order) {
      throw new NotFoundException("Không tìm thấy đơn hàng");
    }

    if (order.user.toString() !== userId) {
      throw new UnauthorizedException("Bạn không có quyền áp dụng mã cho đơn này");
    }

    if (!order.coupon) {
      throw new BadRequestException("Đơn hàng này không sử dụng mã giảm giá");
    }

    if (order.coupon.toString() !== couponId) {
      throw new BadRequestException("Mã giảm giá không khớp với đơn hàng");
    }

    const existing = await this.couponRepository.getUsageByOrderAndCoupon(orderId, couponId);
    if (existing) {
      return { message: "Mã giảm giá đã được ghi nhận cho đơn hàng này" };
    }

    const userUsage = await this.couponRepository.getUsage(userId, couponId);
    if (userUsage) {
      throw new BadRequestException("Bạn đã sử dụng mã này rồi");
    }

    const coupon = await this.couponRepository.findById(couponId);
    if (!coupon) {
      throw new NotFoundException("Mã giảm giá không tồn tại");
    }

    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
      throw new BadRequestException("Mã giảm giá đã đạt số lượt sử dụng tối đa");
    }

    await this.couponRepository.createUsage({
      user: userId,
      coupon: couponId,
      order: orderId,
    });

    const updateResult = await this.couponRepository.updateCouponUsedCount(couponId);
    if (updateResult.modifiedCount === 0) {
      await this.couponRepository.deleteUsage(userId, couponId, orderId);
      throw new BadRequestException("Mã giảm giá đã đạt số lượt sử dụng tối đa");
    }

    return { message: "Áp dụng mã giảm giá thành công" };
  }

  // Admin Methods
  async getAllCoupons(page: number, limit: number) {
    const data = await this.couponRepository.findPaginated({}, page, limit, { createdAt: -1 });
    return {
      coupons: data.results,
      page: data.page,
      totalPages: data.totalPages,
      totalItems: data.totalItems,
    };
  }

  async createCoupon(data: CreateCouponInput) {
    const normalizedCode = data.code.trim().toUpperCase();
    const existing = await this.couponRepository.findByCode(normalizedCode);
    if (existing) {
      throw new BadRequestException("Mã giảm giá đã tồn tại");
    }

    const start = new Date(data.startDate);
    const end = new Date(data.endDate);

    if (start >= end) {
      throw new BadRequestException("Ngày kết thúc phải sau ngày bắt đầu");
    }

    if (data.discountType === "percent" && data.discountValue > 100) {
      throw new BadRequestException("Phần trăm giảm tối đa là 100%");
    }

    const payload = {
      ...data,
      code: normalizedCode,
      startDate: start,
      endDate: end,
      maxDiscountValue: data.discountType === "percent" ? data.maxDiscountValue : undefined,
    };

    return this.couponRepository.create(payload);
  }

  async updateCoupon(id: string, data: UpdateCouponInput) {
    const coupon = await this.couponRepository.findById(id);
    if (!coupon) {
      throw new NotFoundException("Coupon không tồn tại");
    }

    if (data.code) {
      const normalizedCode = data.code.trim().toUpperCase();
      if (normalizedCode !== coupon.code) {
        const duplicate = await this.couponRepository.findByCode(normalizedCode);
        if (duplicate) {
          throw new BadRequestException("Mã giảm giá đã tồn tại");
        }
        coupon.code = normalizedCode;
      }
    }

    if (data.description !== undefined) coupon.description = data.description.trim();
    if (data.discountType) {
      coupon.discountType = data.discountType;
    }

    if (data.discountValue !== undefined) {
      if (data.discountValue <= 0) {
        throw new BadRequestException("Giá trị giảm không hợp lệ");
      }
      if (coupon.discountType === "percent" && data.discountValue > 100) {
        throw new BadRequestException("Phần trăm giảm tối đa là 100%");
      }
      coupon.discountValue = data.discountValue;
    }

    if (data.maxDiscountValue !== undefined && coupon.discountType === "percent") {
      if (data.maxDiscountValue < 0) {
        throw new BadRequestException("Giá trị giảm tối đa không hợp lệ");
      }
      coupon.maxDiscountValue = data.maxDiscountValue || undefined;
    }

    if (coupon.discountType !== "percent") {
      coupon.maxDiscountValue = undefined;
    }

    if (data.minOrderValue !== undefined) {
      if (data.minOrderValue < 0) {
        throw new BadRequestException("Đơn hàng tối thiểu không hợp lệ");
      }
      coupon.minOrderValue = data.minOrderValue;
    }

    if (data.usageLimit !== undefined) {
      if (data.usageLimit < 0) {
        throw new BadRequestException("Giới hạn sử dụng phải là số nguyên không âm");
      }
      if (data.usageLimit > 0 && coupon.usedCount > data.usageLimit) {
        throw new BadRequestException("Giới hạn nhỏ hơn số lượt đã sử dụng");
      }
      coupon.usageLimit = data.usageLimit;
    }

    if (data.startDate) {
      coupon.startDate = new Date(data.startDate);
    }
    if (data.endDate) {
      coupon.endDate = new Date(data.endDate);
    }

    if (coupon.startDate >= coupon.endDate) {
      throw new BadRequestException("Ngày kết thúc phải sau ngày bắt đầu");
    }

    if (typeof data.isActive === "boolean") {
      coupon.isActive = data.isActive;
    }

    await coupon.save();
    return coupon;
  }

  async toggleCouponStatus(id: string) {
    const coupon = await this.couponRepository.findById(id);
    if (!coupon) {
      throw new NotFoundException("Coupon không tồn tại");
    }
    coupon.isActive = !coupon.isActive;
    await coupon.save();
    return coupon;
  }

  async deleteCoupon(id: string) {
    const coupon = await this.couponRepository.delete(id);
    if (!coupon) {
      throw new NotFoundException("Coupon không tồn tại");
    }
    return { message: "Xóa coupon thành công", id };
  }
}
