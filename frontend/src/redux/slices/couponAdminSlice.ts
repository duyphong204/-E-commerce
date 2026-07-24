import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "../../utils/axiosConfig";
import { Coupon, CouponAdminState, CreateCouponPayload, UpdateCouponPayload } from "../../types";

const API_URL = import.meta.env.VITE_API_URL || "";

const initialState: CouponAdminState = {
  coupons: [],
  loading: false,
  error: null,
  status: "idle",
};

export const fetchCoupons = createAsyncThunk<
  Coupon[],
  void,
  { rejectValue: { message: string } }
>(
  "couponAdmin/fetchCoupons",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<Coupon[]>(`${API_URL}/api/coupons`);
      return response.data;
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      return rejectWithValue({
        message: errorObj.response?.data?.message || "Không thể tải danh sách mã giảm giá",
      });
    }
  }
);

export const createCoupon = createAsyncThunk<
  Coupon,
  CreateCouponPayload,
  { rejectValue: { message: string } }
>(
  "couponAdmin/createCoupon",
  async (couponData, { rejectWithValue }) => {
    try {
      const response = await axios.post<Coupon>(`${API_URL}/api/coupons`, couponData);
      return response.data;
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      return rejectWithValue({
        message: errorObj.response?.data?.message || "Không thể tạo mã giảm giá",
      });
    }
  }
);

export const updateCoupon = createAsyncThunk<
  Coupon,
  UpdateCouponPayload,
  { rejectValue: { message: string } }
>(
  "couponAdmin/updateCoupon",
  async ({ id, ...couponData }, { rejectWithValue }) => {
    try {
      const response = await axios.put<Coupon>(`${API_URL}/api/coupons/${id}`, couponData);
      return response.data;
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      return rejectWithValue({
        message: errorObj.response?.data?.message || "Không thể cập nhật mã giảm giá",
      });
    }
  }
);

export const deleteCoupon = createAsyncThunk<
  string,
  string,
  { rejectValue: { message: string } }
>(
  "couponAdmin/deleteCoupon",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/api/coupons/${id}`);
      return id;
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      return rejectWithValue({
        message: errorObj.response?.data?.message || "Không thể xóa mã giảm giá",
      });
    }
  }
);

export const toggleCouponStatus = createAsyncThunk<
  Coupon,
  string,
  { rejectValue: { message: string } }
>(
  "couponAdmin/toggleStatus",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.patch<Coupon>(`${API_URL}/api/coupons/${id}/toggle`);
      return response.data;
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      return rejectWithValue({
        message: errorObj.response?.data?.message || "Không thể thay đổi trạng thái mã",
      });
    }
  }
);

export const getCouponAnalytics = createAsyncThunk<
  unknown,
  string,
  { rejectValue: { message: string } }
>(
  "couponAdmin/getAnalytics",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/coupons/${id}/analytics`);
      return response.data;
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      return rejectWithValue({
        message: errorObj.response?.data?.message || "Không thể lấy thống kê mã giảm giá",
      });
    }
  }
);

const couponAdminSlice = createSlice({
  name: "couponAdmin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoupons.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading";
      })
      .addCase(fetchCoupons.fulfilled, (state, action: PayloadAction<Coupon[]>) => {
        state.loading = false;
        state.coupons = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Không thể tải danh sách mã giảm giá";
        state.status = "failed";
      })

      .addCase(createCoupon.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCoupon.fulfilled, (state, action: PayloadAction<Coupon>) => {
        state.loading = false;
        state.coupons.unshift(action.payload);
      })
      .addCase(createCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Không thể tạo mã giảm giá";
      })

      .addCase(updateCoupon.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCoupon.fulfilled, (state, action: PayloadAction<Coupon>) => {
        state.loading = false;
        const index = state.coupons.findIndex((c) => c._id === action.payload._id);
        if (index !== -1) {
          state.coupons[index] = action.payload;
        }
      })
      .addCase(updateCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Không thể cập nhật mã giảm giá";
      })

      .addCase(deleteCoupon.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCoupon.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.coupons = state.coupons.filter((c) => c._id !== action.payload);
      })
      .addCase(deleteCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Không thể xóa mã giảm giá";
      })

      .addCase(toggleCouponStatus.fulfilled, (state, action: PayloadAction<Coupon>) => {
        const index = state.coupons.findIndex((c) => c._id === action.payload._id);
        if (index !== -1) {
          state.coupons[index] = action.payload;
        }
      });
  },
});

export default couponAdminSlice.reducer;
