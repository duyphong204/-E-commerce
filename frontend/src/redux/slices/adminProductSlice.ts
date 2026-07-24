import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "../../utils/axiosConfig";
import { Product, CreateProductPayload } from "../../types";

const API_URL = import.meta.env.VITE_API_URL || "";

export interface AdminProductsResponse {
  results: Product[];
  page: number;
  totalPages: number;
  totalItems: number;
  statistics: { activeCount: number; lowStockCount: number };
}

export interface FetchAdminProductsParams {
  page?: number;
  limit?: number;
}

export interface SearchAdminProductsParams extends FetchAdminProductsParams {
  term: string;
}

export interface UpdateAdminProductPayload {
  id: string;
  productData: Partial<CreateProductPayload>;
}

export const fetchAdminProducts = createAsyncThunk<
  AdminProductsResponse,
  FetchAdminProductsParams,
  { rejectValue: { message: string } }
>(
  "adminProducts/fetchAdminProducts",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<AdminProductsResponse>(
        `${API_URL}/api/admin/products?page=${page}&limit=${limit}`
      );
      return data;
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      return rejectWithValue({
        message: errorObj.response?.data?.message || "Failed to fetch products",
      });
    }
  }
);

export const searchAdminProducts = createAsyncThunk<
  AdminProductsResponse,
  SearchAdminProductsParams,
  { rejectValue: { message: string } }
>(
  "adminProducts/searchAdminProducts",
  async ({ term, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<AdminProductsResponse>(
        `${API_URL}/api/admin/products/search?term=${term}&page=${page}&limit=${limit}`
      );
      return data;
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      return rejectWithValue({
        message: errorObj.response?.data?.message || "Không tìm thấy sản phẩm",
      });
    }
  }
);

export const createProduct = createAsyncThunk<
  Product,
  CreateProductPayload | FormData,
  { rejectValue: { message: string } }
>(
  "adminProducts/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post<Product>(
        `${API_URL}/api/admin/products`,
        productData
      );
      return data;
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      return rejectWithValue({
        message: errorObj.response?.data?.message || "Tạo sản phẩm thất bại",
      });
    }
  }
);

export const updateProduct = createAsyncThunk<
  Product,
  UpdateAdminProductPayload,
  { rejectValue: { message: string } }
>(
  "adminProducts/updateProduct",
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put<Product>(
        `${API_URL}/api/admin/products/${id}`,
        productData
      );
      return data;
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      return rejectWithValue({
        message: errorObj.response?.data?.message || "Cập nhật thất bại",
      });
    }
  }
);

export const deleteProduct = createAsyncThunk<
  string,
  string,
  { rejectValue: { message: string } }
>(
  "adminProducts/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/api/admin/products/${id}`);
      return id;
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      return rejectWithValue({
        message: errorObj.response?.data?.message || "Xóa thất bại",
      });
    }
  }
);

export interface AdminProductSliceState {
  products: Product[];
  page: number;
  totalPages: number;
  totalItems: number;
  statistics: { activeCount: number; lowStockCount: number };
  loading: boolean;
  error: string | null;
}

const initialState: AdminProductSliceState = {
  products: [],
  page: 1,
  totalPages: 1,
  totalItems: 0,
  statistics: { activeCount: 0, lowStockCount: 0 },
  loading: false,
  error: null,
};

const adminProductSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action: PayloadAction<AdminProductsResponse>) => {
        state.loading = false;
        state.products = action.payload.results;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.totalItems = action.payload.totalItems;
        state.statistics = action.payload.statistics;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Lỗi khi tải sản phẩm";
      })

      .addCase(searchAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchAdminProducts.fulfilled, (state, action: PayloadAction<AdminProductsResponse>) => {
        state.loading = false;
        state.products = action.payload.results;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.totalItems = action.payload.totalItems;
        state.statistics = action.payload.statistics;
      })
      .addCase(searchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Không tìm thấy sản phẩm";
      })

      .addCase(createProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.loading = false;
        state.products.unshift(action.payload);
        state.totalItems += 1;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Tạo sản phẩm thất bại";
      })

      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        const idx = state.products.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) state.products[idx] = action.payload;
      })

      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<string>) => {
        state.products = state.products.filter((p) => p._id !== action.payload);
        state.totalItems -= 1;
      });
  },
});

export default adminProductSlice.reducer;
