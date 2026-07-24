import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "../../utils/axiosConfig";
import { Order, OrderState } from "../../types";

const API_URL = import.meta.env.VITE_API_URL || "";

export const fetchUserOrders = createAsyncThunk<
  Order[],
  void,
  { rejectValue: { message: string } }
>(
  "order/fetchUserOrders",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<Order[]>(`${API_URL}/api/orders/my-orders`);
      return data;
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      const message = errorObj.response?.data?.message || "Không thể tải đơn hàng";
      return rejectWithValue({ message });
    }
  }
);

export const fetchOrderDetails = createAsyncThunk<
  Order,
  string,
  { rejectValue: { message: string } }
>(
  "order/fetchOrderDetails",
  async (orderId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<Order>(`${API_URL}/api/orders/${orderId}`);
      return data;
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      const message = errorObj.response?.data?.message || "Không thể tải chi tiết đơn hàng";
      return rejectWithValue({ message });
    }
  }
);

const initialState: OrderState = {
  orders: [],
  orderDetails: null,
  loading: false,
  error: null,
  totalOrders: 0,
  status: "idle",
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading";
      })
      .addCase(fetchUserOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
        state.loading = false;
        state.orders = action.payload;
        state.totalOrders = action.payload?.length || 0;
        state.status = "succeeded";
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Lỗi tải đơn hàng";
        state.status = "failed";
      })

      .addCase(fetchOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        state.orderDetails = action.payload;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Lỗi tải chi tiết đơn hàng";
      });
  },
});

export default orderSlice.reducer;
