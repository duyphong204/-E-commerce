import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "../../utils/axiosConfig";

const API_URL = import.meta.env.VITE_API_URL || "";

export interface ValidateCouponParams {
  code: string;
  userId?: string;
  totalPrice: number;
}

export interface ValidateCouponResponse {
  couponId: string;
  code: string;
  discountAmount: number;
  finalTotal: number;
  message?: string;
}

export interface AppliedCouponInfo {
  id: string;
  code: string;
}

export const validateCoupon = createAsyncThunk<
  ValidateCouponResponse,
  ValidateCouponParams,
  { rejectValue: string }
>(
  "couponUser/validate",
  async ({ code, userId, totalPrice }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post<ValidateCouponResponse>(
        `${API_URL}/api/coupons/validate`,
        { code, userId, totalPrice }
      );
      return data;
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        errorObj.response?.data?.message || "Mã giảm giá không hợp lệ"
      );
    }
  }
);

export interface CouponUserSliceState {
  coupon: AppliedCouponInfo | null;
  discountAmount: number;
  finalTotal: number | null;
  loading: boolean;
  error: string | null;
}

const initialState: CouponUserSliceState = {
  coupon: null,
  discountAmount: 0,
  finalTotal: null,
  loading: false,
  error: null,
};

const couponUserSlice = createSlice({
  name: "couponUser",
  initialState,
  reducers: {
    clearCoupon: (state) => {
      state.coupon = null;
      state.discountAmount = 0;
      state.finalTotal = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(validateCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(validateCoupon.fulfilled, (state, action: PayloadAction<ValidateCouponResponse>) => {
        state.loading = false;
        state.coupon = {
          id: action.payload.couponId,
          code: action.payload.code,
        };
        state.discountAmount = action.payload.discountAmount;
        state.finalTotal = action.payload.finalTotal;
      })
      .addCase(validateCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Mã giảm giá không hợp lệ";
        state.coupon = null;
        state.discountAmount = 0;
        state.finalTotal = null;
      });
  },
});

export const { clearCoupon } = couponUserSlice.actions;
export default couponUserSlice.reducer;
