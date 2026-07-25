import Coupon from "../../models/Coupon";
import CouponUsage from "../../models/CouponUsage";
import Order from "../../models/Order";
import { paginate, PaginatedResult } from "../../common/utils/pagination";

export class CouponRepository {
  async findById(id: string) {
    return Coupon.findById(id);
  }

  async findByCode(code: string) {
    return Coupon.findOne({ code });
  }

  async create(couponData: any) {
    return Coupon.create(couponData);
  }

  async delete(id: string) {
    return Coupon.findByIdAndDelete(id);
  }

  async findPaginated(query: any, page: number, limit: number, sort: any): Promise<PaginatedResult<any>> {
    return paginate(Coupon as any, query, { page, limit, sort });
  }

  async getUsage(userId: string, couponId: string) {
    return CouponUsage.findOne({ user: userId, coupon: couponId });
  }

  async getUsageByOrderAndCoupon(orderId: string, couponId: string) {
    return CouponUsage.findOne({ order: orderId, coupon: couponId });
  }

  async createUsage(usageData: { user: string; coupon: string; order: string }) {
    return CouponUsage.create(usageData);
  }

  async deleteUsage(userId: string, couponId: string, orderId: string) {
    return CouponUsage.deleteOne({ user: userId, coupon: couponId, order: orderId });
  }

  async getOrderById(orderId: string) {
    return Order.findById(orderId);
  }

  async updateCouponUsedCount(couponId: string) {
    return Coupon.updateOne(
      {
        _id: couponId,
        $expr: {
          $or: [
            { $eq: ["$usageLimit", 0] },
            { $lt: ["$usedCount", "$usageLimit"] },
          ],
        },
      },
      { $inc: { usedCount: 1 } }
    );
  }

  async findAll(sort: any = { createdAt: -1 }) {
    return Coupon.find({}).sort(sort);
  }
}
