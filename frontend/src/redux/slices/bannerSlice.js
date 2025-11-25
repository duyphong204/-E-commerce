import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axiosConfig";

const API_URL = import.meta.env.VITE_API_URL;

// Lấy banners active (user)
export const fetchActiveBanners = createAsyncThunk(
    "banners/fetchActive",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/api/banners`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Lỗi khi tải banners");
        }
    }
);

// Lấy tất cả banners (admin)
export const fetchAllBanners = createAsyncThunk(
    "banners/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/api/banners/admin`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Lỗi khi tải banners");
        }
    }
);

// Tạo banner
export const createBanner = createAsyncThunk(
    "banners/create",
    async (bannerData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/api/banners`, bannerData);
            return response.data.banner;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Lỗi khi tạo banner");
        }
    }
);

// Cập nhật banner
export const updateBanner = createAsyncThunk(
    "banners/update",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_URL}/api/banners/${id}`, data);
            return response.data.banner;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Lỗi khi cập nhật banner");
        }
    }
);

// Xóa banner
export const deleteBanner = createAsyncThunk(
    "banners/delete",
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_URL}/api/banners/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Lỗi khi xóa banner");
        }
    }
);

// Toggle status
export const toggleBannerStatus = createAsyncThunk(
    "banners/toggleStatus",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.patch(`${API_URL}/api/banners/${id}/toggle`);
            return response.data.banner;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Lỗi khi toggle banner");
        }
    }
);

const bannerSlice = createSlice({
    name: "banners",
    initialState: {
        banners: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch active banners
            .addCase(fetchActiveBanners.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchActiveBanners.fulfilled, (state, action) => {
                state.loading = false;
                state.banners = action.payload;
            })
            .addCase(fetchActiveBanners.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch all banners (admin)
            .addCase(fetchAllBanners.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAllBanners.fulfilled, (state, action) => {
                state.loading = false;
                state.banners = action.payload;
            })
            .addCase(fetchAllBanners.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Create banner
            .addCase(createBanner.fulfilled, (state, action) => {
                state.banners.push(action.payload);
            })

            // Update banner
            .addCase(updateBanner.fulfilled, (state, action) => {
                const index = state.banners.findIndex((b) => b._id === action.payload._id);
                if (index !== -1) {
                    state.banners[index] = action.payload;
                }
            })

            // Delete banner
            .addCase(deleteBanner.fulfilled, (state, action) => {
                state.banners = state.banners.filter((b) => b._id !== action.payload);
            })

            // Toggle status
            .addCase(toggleBannerStatus.fulfilled, (state, action) => {
                const index = state.banners.findIndex((b) => b._id === action.payload._id);
                if (index !== -1) {
                    state.banners[index] = action.payload;
                }
            });
    },
});

export default bannerSlice.reducer;
