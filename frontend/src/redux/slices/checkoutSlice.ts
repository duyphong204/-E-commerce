import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "../../utils/axiosConfig";
import { Order, CheckoutState, CreateOrderPayload } from "../../types";

const API_URL = import.meta.env.VITE_API_URL || "";

export const createCheckout = createAsyncThunk<
  Order,
  CreateOrderPayload,
  { rejectValue: { message: string; errors?: string[] } }
>(
  "checkout/createCheckout",
  async (checkoutData, { rejectWithValue }) => {
    try {
      const response = await axios.post<Order>(
        `${API_URL}/api/checkout`,
        checkoutData
      );
      return response.data;
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string; errors?: string[] } } };
      return rejectWithValue({
        message: errorObj.response?.data?.message || "Không thể tạo đơn hàng",
        errors: errorObj.response?.data?.errors,
      });
    }
  }
);

export const markCheckoutAsPaid = createAsyncThunk<
  Order,
  { checkoutId: string; paymentDetails: unknown },
  { rejectValue: { message: string } }
>(
  "checkout/markAsPaid",
  async ({ checkoutId, paymentDetails }, { rejectWithValue }) => {
    try {
      const response = await axios.put<Order>(
        `${API_URL}/api/checkout/${checkoutId}/pay`,
        { paymentStatus: "Paid", paymentDetails }
      );
      return response.data;
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      return rejectWithValue({
        message: errorObj.response?.data?.message || "Cập nhật thanh toán thất bại",
      });
    }
  }
);

export const finalizeCheckout = createAsyncThunk<
  unknown,
  string,
  { rejectValue: { message: string } }
>(
  "checkout/finalizeCheckout",
  async (checkoutId, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/checkout/${checkoutId}/finalize`,
        {}
      );
      return response.data;
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      return rejectWithValue({
        message: errorObj.response?.data?.message || "Hoàn tất đơn hàng thất bại",
      });
    }
  }
);

const initialState: CheckoutState = {
  checkout: null,
  loading: false,
  error: null,
  status: "idle",
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading";
      })
      .addCase(createCheckout.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        state.checkout = action.payload;
        state.status = "succeeded";
      })
      .addCase(createCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = Array.isArray(action.payload?.errors)
          ? action.payload.errors.join(" | ")
          : action.payload?.message || "Không thể tạo đơn hàng";
        state.status = "failed";
      })

      .addCase(markCheckoutAsPaid.pending, (state) => {
        state.loading = true;
      })
      .addCase(markCheckoutAsPaid.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        state.checkout = action.payload;
      })
      .addCase(markCheckoutAsPaid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Cập nhật thanh toán thất bại";
      })

      .addCase(finalizeCheckout.pending, (state) => {
        state.loading = true;
      })
      .addCase(finalizeCheckout.fulfilled, (state) => {
        state.loading = false;
        state.checkout = null;
      })
      .addCase(finalizeCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Hoàn tất đơn hàng thất bại";
      });
  },
});

export default checkoutSlice.reducer;
