import { AsyncStatus } from '@/types';

export type DiscountType = 'percentage' | 'percent' | 'fixed';

export interface Coupon {
  _id: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minPurchaseAmount?: number;
  minOrderValue?: number;
  maxDiscountAmount?: number;
  maxDiscountValue?: number;
  expirationDate?: string;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  usageLimit?: number;
  usedCount?: number;
  createdAt?: string;
}

export interface CouponUserState {
  appliedCoupon: Coupon | null;
  discountAmount: number;
  loading: boolean;
  error: string | null;
}

export interface CouponAdminState {
  coupons: Coupon[];
  loading: boolean;
  error: string | null;
  status: AsyncStatus;
}

export interface CreateCouponPayload {
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minPurchaseAmount?: number;
  minOrderValue?: number;
  maxDiscountAmount?: number;
  maxDiscountValue?: number;
  expirationDate?: string;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
  usageLimit?: number;
}

export interface UpdateCouponPayload extends Partial<CreateCouponPayload> {
  id: string;
}

export interface ApplyCouponPayload {
  code: string;
  cartTotal: number;
}
