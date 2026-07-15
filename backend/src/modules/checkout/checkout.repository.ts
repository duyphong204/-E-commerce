import Checkout from "../../models/Checkout";
import Product from "../../models/Product";
import Coupon from "../../models/Coupon";
import CouponUsage from "../../models/CouponUsage";
import Order from "../../models/Order";
import Cart from "../../models/Cart";

export class CheckoutRepository {
  async findById(id: string) {
    return Checkout.findById(id);
  }

  async findByIdWithSession(id: string, session: any) {
    return Checkout.findById(id).session(session);
  }

  async create(checkoutData: any[], options?: { session: any }) {
    return Checkout.create(checkoutData, options);
  }

  async findProductByIdWithSession(productId: string, session: any) {
    return Product.findById(productId).session(session);
  }

  async findCouponByIdWithSession(couponId: string, session: any) {
    return Coupon.findById(couponId).session(session);
  }

  async findCouponUsageWithSession(orderId: string, couponId: string, session: any) {
    return CouponUsage.findOne({ order: orderId, coupon: couponId }).session(session);
  }

  async createCouponUsage(usageData: any[], options: { session: any }) {
    return CouponUsage.create(usageData, options);
  }

  async updateCouponUsedCount(couponId: string, session: any) {
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
      { $inc: { usedCount: 1 } },
      { session }
    );
  }

  async createOrder(orderData: any[], options: { session: any }) {
    return Order.create(orderData, options);
  }

  async updateProductStock(productId: string, quantity: number, session: any) {
    return Product.findByIdAndUpdate(
      productId,
      {
        $inc: { countInStock: -quantity, soldCount: quantity },
      },
      { session }
    );
  }

  async deleteCart(userId: string, session: any) {
    return Cart.findOneAndDelete({ user: userId }).session(session);
  }
}
