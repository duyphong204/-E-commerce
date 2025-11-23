import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axiosConfig";

const API_URL = import.meta.env.VITE_API_URL;

// Lấy danh sách wishlist
export const fetchWishlist = createAsyncThunk(
  "wishList/fetchWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/api/wishlist`);
      return data.wishlist;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Không thể tải wishlist");
    }
  }
);

// Thêm sản phẩm vào wishlist
export const addToWishlist = createAsyncThunk(
  "wishList/addToWishlist",
  async ({ productId }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${API_URL}/api/wishlist/${productId}`, null);
      return data.wishlist[data.wishlist.length - 1];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Không thể thêm sản phẩm");
    }
  }
);

// Xóa sản phẩm khỏi wishlist
export const removeFromWishlist = createAsyncThunk(
  "wishList/removeFromWishlist",
  async ({ productId }, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/api/wishlist/${productId}`);
      return productId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Không thể xóa sản phẩm");
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishList",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item._id !== action.payload);
      });
  },
});

export default wishlistSlice.reducer;
