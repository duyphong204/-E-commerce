import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axiosConfig";

const API_URL = import.meta.env.VITE_API_URL;

// --- Fetch All Orders ---
export const fetchAllOrders = createAsyncThunk(
  "adminOrders/fetchAllOrders",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${API_URL}/api/admin/orders?page=${page}&limit=${limit}`
      );
      return data;
    } catch (err) {
      return rejectWithValue({
        message: err.response?.data?.message || "Lỗi tải đơn hàng",
      });
    }
  }
);

// --- Search Orders ---
export const searchOrder = createAsyncThunk(
  "adminOrders/searchOrder",
  async ({ term, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${API_URL}/api/admin/orders/search?term=${term}&page=${page}&limit=${limit}`
      );
      return data;
    } catch (err) {
      return rejectWithValue({
        message: err.response?.data?.message || "Không tìm thấy",
      });
    }
  }
);

// --- Update Order Status ---
export const updateOrderStatus = createAsyncThunk(
  "adminOrders/updateOrderStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`${API_URL}/api/admin/orders/${id}`, {
        status,
      });
      return data;
    } catch (err) {
      return rejectWithValue({
        message: err.response?.data?.message || "Cập nhật thất bại",
      });
    }
  }
);

// --- Delete Order ---
export const deleteOrder = createAsyncThunk(
  "adminOrders/deleteOrder",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/api/admin/orders/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue({
        message: err.response?.data?.message || "Failed to delete order",
      });
    }
  }
);

// --- Fetch Order Detail ---
export const fetchOrderDetail = createAsyncThunk(
  "adminOrders/fetchOrderDetail",
  async (orderId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/api/admin/orders/${orderId}`);
      return data;
    } catch (err) {
      return rejectWithValue({
        message: err.response?.data?.message || "Không thể tải chi tiết đơn hàng",
      });
    }
  }
);

const adminOrderSlice = createSlice({
  name: "adminOrders",
  initialState: {
    orders: [],
    selectedOrder: null,
    page: 1,
    totalPages: 1,
    totalItems: 0,
    totalSales: 0,
    processingCount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    resetSelectedOrder: (state) => {
      state.selectedOrder = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Fetch All Orders ---
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.results;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.totalItems = action.payload.totalItems;
        state.totalSales = action.payload.totalSales;
        state.processingCount = action.payload.processingCount;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // --- Search Orders ---
      .addCase(searchOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.results;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.totalItems = action.payload.totalItems;
        state.totalSales = action.payload.totalSales;
        state.processingCount = action.payload.processingCount;
      })
      .addCase(searchOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // --- Update Order Status ---
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const idx = state.orders.findIndex((o) => o._id === action.payload._id);
        if (idx !== -1) state.orders[idx] = action.payload;
      })

      // --- Delete Order ---
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter((o) => o._id !== action.payload);
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.error = action.payload?.message;
      })

      // --- Fetch Order Detail ---
      .addCase(fetchOrderDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(fetchOrderDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      });
  },
});

export const { resetSelectedOrder } = adminOrderSlice.actions;

export default adminOrderSlice.reducer;