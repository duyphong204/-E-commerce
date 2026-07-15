import mongoose, { Schema, Document } from "mongoose";

export interface ICouponUsage extends Document {
  user: mongoose.Types.ObjectId;
  coupon: mongoose.Types.ObjectId;
  order: mongoose.Types.ObjectId;
  usedAt: Date;
}

const couponUsageSchema = new Schema<ICouponUsage>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  coupon: {
    type: Schema.Types.ObjectId,
    ref: "Coupon",
    required: true,
  },
  order: {
    type: Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  usedAt: {
    type: Date,
    default: Date.now,
  },
});

couponUsageSchema.index({ user: 1, coupon: 1 }, { unique: true });
couponUsageSchema.index({ order: 1 }, { unique: true });

const CouponUsage = mongoose.model<ICouponUsage>("CouponUsage", couponUsageSchema);
export default CouponUsage;
