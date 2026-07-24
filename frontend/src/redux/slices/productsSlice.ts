import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "../../utils/axiosConfig";
import { Product, ProductFilters, ProductsState } from "../../types";

const API_URL = import.meta.env.VITE_API_URL || "";

const buildQuery = (filters: ProductFilters): string => {
  const query = new URLSearchParams();

  for (const key in filters) {
    const value = filters[key as keyof ProductFilters];
    if (value === "" || value === null || value === undefined) continue;
    query.append(key, String(value));
  }

  return query.toString();
};

export interface FetchProductsResponse {
  products: Product[];
  page: number;
  totalPages: number;
  totalItems: number;
}

export const fetchProductsByFilters = createAsyncThunk<
  FetchProductsResponse,
  ProductFilters,
  { rejectValue: string }
>(
  "products/fetchByFilters",
  async (filters, { rejectWithValue }) => {
    try {
      const queryString = buildQuery(filters);
      const response = await axios.get<FetchProductsResponse>(
        `${API_URL}/api/products/filters?${queryString}`
      );
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err.response?.data?.message || "Lỗi khi tải sản phẩm"
      );
    }
  }
);

export const fetchProductDetails = createAsyncThunk<
  Product,
  string,
  { rejectValue: string }
>(
  "products/fetchDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get<Product>(`${API_URL}/api/products/${id}`);
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err.response?.data?.message || "Không thể tải chi tiết sản phẩm"
      );
    }
  }
);

export const fetchSimilarProducts = createAsyncThunk<
  Product[],
  { id: string },
  { rejectValue: string }
>(
  "products/fetchSimilarProducts",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await axios.get<Product[]>(`${API_URL}/api/products/similar/${id}`);
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err.response?.data?.message || "Không thể tải sản phẩm tương tự"
      );
    }
  }
);

export const fetchBestSellerProducts = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>(
  "products/fetchBestSeller",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<Product[]>(`${API_URL}/api/products/best-seller`);
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err.response?.data?.message || "Không thể tải sản phẩm bán chạy"
      );
    }
  }
);

export const fetchMostLikedProducts = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>(
  "products/fetchMostLiked",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<Product[]>(`${API_URL}/api/products/most-liked`);
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err.response?.data?.message || "Không thể tải sản phẩm yêu thích"
      );
    }
  }
);

export const fetchNewArrivalsProducts = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>(
  "products/fetchNewArrivals",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<Product[]>(`${API_URL}/api/products/new-arrivals`);
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        err.response?.data?.message || "Không thể tải sản phẩm mới"
      );
    }
  }
);

interface ExtendedProductsState extends ProductsState {
  page: number;
  totalPages: number;
  totalItems: number;
  bestSellerProducts: Product[];
  mostLikedProducts: Product[];
  newArrivalsProducts: Product[];
}

const initialState: ExtendedProductsState = {
  products: [],
  page: 1,
  totalPages: 1,
  totalItems: 0,
  selectedProduct: null,
  similarProducts: [],
  bestSellerProducts: [],
  mostLikedProducts: [],
  newArrivalsProducts: [],
  newArrivals: [],
  bestSellers: [],
  loading: false,
  error: null,
  status: "idle",
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
  },
  filters: {
    category: "",
    size: "",
    color: "",
    gender: "",
    brand: "",
    minPrice: "",
    maxPrice: "",
    sortBy: "",
    search: "",
    material: "",
    collection: "",
  },
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<ProductFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        category: "",
        size: "",
        color: "",
        gender: "",
        brand: "",
        minPrice: "",
        maxPrice: "",
        sortBy: "",
        search: "",
        material: "",
        collection: "",
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsByFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading";
      })
      .addCase(fetchProductsByFilters.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products || [];
        state.page = action.payload.page || 1;
        state.totalPages = action.payload.totalPages || 1;
        state.totalItems = action.payload.totalItems || 0;
        state.status = "succeeded";
      })
      .addCase(fetchProductsByFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Lỗi khi tải sản phẩm";
        state.status = "failed";
      })

      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action: PayloadAction<Product>) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Không thể tải chi tiết sản phẩm";
      })

      .addCase(fetchSimilarProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSimilarProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.similarProducts = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchSimilarProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Không thể tải sản phẩm tương tự";
      })

      .addCase(fetchBestSellerProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBestSellerProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.bestSellerProducts = Array.isArray(action.payload) ? action.payload : [];
        state.bestSellers = state.bestSellerProducts;
      })
      .addCase(fetchBestSellerProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Không thể tải sản phẩm bán chạy";
      })

      .addCase(fetchMostLikedProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMostLikedProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.mostLikedProducts = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchMostLikedProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Không thể tải sản phẩm yêu thích";
      })

      .addCase(fetchNewArrivalsProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewArrivalsProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.newArrivalsProducts = Array.isArray(action.payload) ? action.payload : [];
        state.newArrivals = state.newArrivalsProducts;
      })
      .addCase(fetchNewArrivalsProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Không thể tải sản phẩm mới";
      });
  },
});

export const { setFilters, clearFilters } = productsSlice.actions;
export default productsSlice.reducer;
