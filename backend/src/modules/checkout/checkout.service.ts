import mongoose from "mongoose";
import { CheckoutRepository } from "./checkout.repository";
import { CreateCheckoutInput, MarkAsPaidInput } from "./checkout.schema";
import { validateCouponForUser } from "../../common/utils/coupon";
import { BadRequestException, NotFoundException } from "../../common/exceptions/HttpException";

export class CheckoutService {
  private checkoutRepository: CheckoutRepository;

  constructor() {
    this.checkoutRepository = new CheckoutRepository();
  }

  async createCheckoutSession(userId: string, data: CreateCheckoutInput) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const {
        checkoutItems,
        shippingAddress,
        paymentMethod,
        totalPrice: clientTotal,
        couponCode,
        couponId,
      } = data;

      const stockErrors: string[] = [];
      const validItems: any[] = [];

      for (const item of checkoutItems) {
        const product = await this.checkoutRepository.findProductByIdWithSession(item.productId, session);
        if (!product) {
          stockErrors.push(`Sản phẩm không tồn tại: ${item.productId}`);
          continue;
        }

        if (!product.isPublished || product.status !== "active") {
          stockErrors.push(`${product.name} đã ngừng kinh doanh`);
          continue;
        }

        const variantKey = `${item.productId}-${item.size}-${item.color}`;
        const existingQty = validItems
          .filter((i) => `${i.productId}-${i.size}-${i.color}` === variantKey)
          .reduce((sum, i) => sum + i.quantity, 0);

        const totalQty = existingQty + item.quantity;

        if (totalQty > product.countInStock) {
          stockErrors.push(
            `${product.name} (size ${item.size}, màu ${item.color}): Chỉ còn ${product.countInStock} sản phẩm (bạn chọn ${totalQty})`
          );
          continue;
        }

        validItems.push(item);
      }

      if (stockErrors.length > 0) {
        throw new BadRequestException("Không đủ hàng để đặt: " + stockErrors.join("; "));
      }

      const cartTotal = validItems.reduce(
        (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
        0
      );

      const providedTotal = Number(clientTotal);
      if (!Number.isNaN(providedTotal) && Math.abs(providedTotal - cartTotal) > 1000) {
        console.warn(`Checkout total mismatch for user ${userId}: client=${providedTotal}, server=${cartTotal}`);
      }

      if (cartTotal <= 0) {
        throw new BadRequestException("Không thể tạo đơn với tổng tiền bằng 0");
      }

      let discountAmount = 0;
      let couponRef = null;

      if (couponCode || couponId) {
        try {
          const { coupon, discountAmount: computedDiscount } = await validateCouponForUser({
            couponCode,
            couponId,
            userId,
            orderTotal: cartTotal,
            session,
          });

          discountAmount = computedDiscount;
          couponRef = coupon._id;
        } catch (validationError: any) {
          throw new BadRequestException(validationError.message);
        }
      }

      const finalPrice = Math.max(cartTotal - discountAmount, 0);

      const newCheckout = await this.checkoutRepository.create(
        [
          {
            user: userId,
            checkoutItems: validItems,
            shippingAddress,
            paymentMethod,
            subtotal: cartTotal,
            totalPrice: finalPrice,
            coupon: couponRef,
            discountAmount,
            paymentStatus: "Pending",
            isPaid: false,
          },
        ],
        { session }
      );

      await session.commitTransaction();

      const checkoutData = newCheckout[0].toObject() as any;
      checkoutData.totalBeforeDiscount = cartTotal;
      checkoutData.discountAmount = discountAmount;
      checkoutData.coupon = couponRef;

      return checkoutData;
    } catch (err: any) {
      await session.abortTransaction();
      console.error("createCheckoutSession error:", err);
      throw err;
    } finally {
      session.endSession();
    }
  }

  async markAsPaid(id: string, data: MarkAsPaidInput) {
    const { paymentStatus, paymentDetails } = data;
    const checkout = await this.checkoutRepository.findById(id);
    if (!checkout) {
      throw new NotFoundException("Không tìm thấy đơn");
    }

    checkout.isPaid = true;
    checkout.paymentStatus = paymentStatus;
    checkout.paymentDetails = paymentDetails;
    checkout.paidAt = new Date();
    await checkout.save();

    return checkout;
  }

  async finalizeCheckout(id: string) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const checkout = await this.checkoutRepository.findByIdWithSession(id, session);
      if (!checkout) {
        throw new NotFoundException("Không tìm thấy đơn");
      }

      if (!checkout.isPaid || checkout.isFinalized) {
        throw new BadRequestException("Đơn chưa thanh toán hoặc đã hoàn tất");
      }

      // Check stock
      for (const item of checkout.checkoutItems) {
        const product = await this.checkoutRepository.findProductByIdWithSession(item.productId.toString(), session);
        if (!product || product.countInStock < item.quantity) {
          throw new BadRequestException(
            `Sản phẩm ${product?.name || item.productId} (size ${item.size}, màu ${item.color}) đã hết hàng`
          );
        }
      }

      // Create Order
      const finalOrder = await this.checkoutRepository.createOrder(
        [
          {
            user: checkout.user,
            orderItems: checkout.checkoutItems,
            shippingAddress: checkout.shippingAddress,
            paymentMethod: checkout.paymentMethod,
            subtotal: checkout.subtotal,
            totalPrice: checkout.totalPrice,
            isPaid: true,
            paidAt: checkout.paidAt,
            paymentStatus: "Paid",
            paymentDetails: checkout.paymentDetails,
            coupon: checkout.coupon,
            discountAmount: checkout.discountAmount,
          },
        ],
        { session }
      );

      // Decrement stock & increment soldCount
      await Promise.all(
        checkout.checkoutItems.map((item: any) =>
          this.checkoutRepository.updateProductStock(item.productId.toString(), item.quantity, session)
        )
      );

      // Create coupon usage
      if (checkout.coupon) {
        const coupon = await this.checkoutRepository.findCouponByIdWithSession(checkout.coupon.toString(), session);
        if (!coupon) {
          throw new BadRequestException("Mã giảm giá không tồn tại");
        }

        if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
          throw new BadRequestException("Mã giảm giá đã đạt số lượt sử dụng tối đa");
        }

        const existingUsage = await this.checkoutRepository.findCouponUsageWithSession(
          (finalOrder[0] as any)._id.toString(),
          checkout.coupon.toString(),
          session
        );

        if (!existingUsage) {
          await this.checkoutRepository.createCouponUsage(
            [
              {
                user: checkout.user,
                coupon: checkout.coupon,
                order: finalOrder[0]._id,
              },
            ],
            { session }
          );

          const updateResult = await this.checkoutRepository.updateCouponUsedCount(checkout.coupon.toString(), session);
          if (updateResult.modifiedCount === 0) {
            throw new BadRequestException("Mã giảm giá đã đạt số lượt sử dụng tối đa");
          }
        }
      }

      // Finalize checkout
      checkout.isFinalized = true;
      checkout.finalizedAt = new Date();
      await checkout.save({ session });

      // Delete Cart
      await this.checkoutRepository.deleteCart(checkout.user.toString(), session);

      await session.commitTransaction();
      return finalOrder[0];
    } catch (err: any) {
      await session.abortTransaction();
      console.error("finalizeCheckout error:", err);
      throw err;
    } finally {
      session.endSession();
    }
  }
}
