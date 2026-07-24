import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "../../utils/axiosConfig";
import { Banner, BannerState, CreateBannerPayload } from "../../types";

const API_URL = import.meta.env.VITE_API_URL || "";

export const fetchActiveBanners = createAsyncThunk<
  Banner[],
  void,
  { rejectValue: string }
>(
  "banners/fetchActive",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<Banner[]>(`${API_URL}/api/banners`);
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Lỗi khi tải banners");
    }
  }
);

export const fetchAllBanners = createAsyncThunk<
  Banner[],
  void,
  { rejectValue: string }
>(
  "banners/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<Banner[]>(`${API_URL}/api/banners/admin`);
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Lỗi khi tải banners");
    }
  }
);

export const createBanner = createAsyncThunk<
  Banner,
  CreateBannerPayload | FormData,
  { rejectValue: string }
>(
  "banners/create",
  async (bannerData, { rejectWithValue }) => {
    try {
      const response = await axios.post<{ banner: Banner }>(`${API_URL}/api/banners`, bannerData);
      return response.data.banner;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Lỗi khi tạo banner");
    }
  }
);

export const updateBanner = createAsyncThunk<
  Banner,
  { id: string; data: Partial<CreateBannerPayload> | FormData },
  { rejectValue: string }
>(
  "banners/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put<{ banner: Banner }>(`${API_URL}/api/banners/${id}`, data);
      return response.data.banner;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Lỗi khi cập nhật banner");
    }
  }
);

export const deleteBanner = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  "banners/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/api/banners/${id}`);
      return id;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Lỗi khi xóa banner");
    }
  }
);

export const toggleBannerStatus = createAsyncThunk<
  Banner,
  string,
  { rejectValue: string }
>(
  "banners/toggleStatus",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.patch<{ banner: Banner }>(`${API_URL}/api/banners/${id}/toggle`);
      return response.data.banner;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Lỗi khi toggle banner");
    }
  }
);

const initialState: BannerState = {
  banners: [],
  loading: false,
  error: null,
  status: "idle",
};

const bannerSlice = createSlice({
  name: "banners",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActiveBanners.pending, (state) => {
        state.loading = true;
        state.status = "loading";
      })
      .addCase(fetchActiveBanners.fulfilled, (state, action: PayloadAction<Banner[]>) => {
        state.loading = false;
        state.banners = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchActiveBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Lỗi khi tải banner";
        state.status = "failed";
      })

      .addCase(fetchAllBanners.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllBanners.fulfilled, (state, action: PayloadAction<Banner[]>) => {
        state.loading = false;
        state.banners = action.payload;
      })
      .addCase(fetchAllBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Lỗi khi tải banner";
      })

      .addCase(createBanner.fulfilled, (state, action: PayloadAction<Banner>) => {
        state.banners.push(action.payload);
      })

      .addCase(updateBanner.fulfilled, (state, action: PayloadAction<Banner>) => {
        const index = state.banners.findIndex((b) => b._id === action.payload._id);
        if (index !== -1) {
          state.banners[index] = action.payload;
        }
      })

      .addCase(deleteBanner.fulfilled, (state, action: PayloadAction<string>) => {
        state.banners = state.banners.filter((b) => b._id !== action.payload);
      })

      .addCase(toggleBannerStatus.fulfilled, (state, action: PayloadAction<Banner>) => {
        const index = state.banners.findIndex((b) => b._id === action.payload._id);
        if (index !== -1) {
          state.banners[index] = action.payload;
        }
      });
  },
});

export default bannerSlice.reducer;
