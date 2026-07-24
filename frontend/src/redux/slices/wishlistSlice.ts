import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "../../utils/axiosConfig";
import { Product } from "../../types";

const API_URL = import.meta.env.VITE_API_URL || "";

export interface WishlistProductItem {
  _id: string;
  product?: Product;
  [key: string]: unknown;
}

export const fetchWishlist = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>(
  "wishList/fetchWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<{ wishlist: Product[] }>(`${API_URL}/api/wishlist`);
      return data.wishlist;
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(errorObj.response?.data?.message || "Không thể tải wishlist");
    }
  }
);

export const addToWishlist = createAsyncThunk<
  Product,
  { productId: string },
  { rejectValue: string }
>(
  "wishList/addToWishlist",
  async ({ productId }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post<{ wishlist: Product[] }>(`${API_URL}/api/wishlist/${productId}`, null);
      return data.wishlist[data.wishlist.length - 1];
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(errorObj.response?.data?.message || "Không thể thêm sản phẩm");
    }
  }
);

export const removeFromWishlist = createAsyncThunk<
  string,
  { productId: string },
  { rejectValue: string }
>(
  "wishList/removeFromWishlist",
  async ({ productId }, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/api/wishlist/${productId}`);
      return productId;
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(errorObj.response?.data?.message || "Không thể xóa sản phẩm");
    }
  }
);

export interface WishlistSliceState {
  items: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: WishlistSliceState = {
  items: [],
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: "wishList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Lỗi tải wishlist";
      })
      .addCase(addToWishlist.fulfilled, (state, action: PayloadAction<Product>) => {
        if (action.payload) {
          state.items.push(action.payload);
        }
      })
      .addCase(removeFromWishlist.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      });
  },
});

export default wishlistSlice.reducer;
