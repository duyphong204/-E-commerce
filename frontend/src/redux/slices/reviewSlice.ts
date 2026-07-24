import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "../../utils/axiosConfig";
import { Review, ReviewState } from "../../types";

const API_URL = import.meta.env.VITE_API_URL || "";

export interface FetchReviewsResponse {
  reviews: Review[];
  avgRating: number;
}

export interface CreateReviewData {
  rating: number;
  comment: string;
}

export const fetchReviews = createAsyncThunk<
  FetchReviewsResponse,
  { productId: string },
  { rejectValue: { message: string } }
>(
  "reviews/fetchReviews",
  async ({ productId }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<FetchReviewsResponse>(`${API_URL}/api/reviews/${productId}`);
      return data;
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      return rejectWithValue({
        message: errorObj.response?.data?.message || "Không thể tải đánh giá",
      });
    }
  }
);

export const createReview = createAsyncThunk<
  Review,
  { productId: string; reviewData: CreateReviewData },
  { rejectValue: { message: string } }
>(
  "reviews/createReview",
  async ({ productId, reviewData }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post<{ review: Review }>(
        `${API_URL}/api/reviews/${productId}/create`,
        reviewData
      );
      return data.review;
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      return rejectWithValue({
        message: errorObj.response?.data?.message || "Không thể tạo đánh giá",
      });
    }
  }
);

export const deleteReview = createAsyncThunk<
  { _id: string },
  { reviewId: string },
  { rejectValue: { message: string } }
>(
  "reviews/deleteReview",
  async ({ reviewId }, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete<{ message?: string }>(`${API_URL}/api/reviews/${reviewId}`);
      return { ...data, _id: reviewId };
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      return rejectWithValue({
        message: errorObj.response?.data?.message || "Không thể xóa đánh giá",
      });
    }
  }
);

interface ExtendedReviewState extends ReviewState {
  avgRating: number;
}

const initialState: ExtendedReviewState = {
  reviews: [],
  loading: false,
  error: null,
  avgRating: 0,
  status: "idle",
};

const reviewSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading";
      })
      .addCase(fetchReviews.fulfilled, (state, action: PayloadAction<FetchReviewsResponse>) => {
        state.loading = false;
        state.reviews = action.payload.reviews;
        state.avgRating = action.payload.avgRating;
        state.status = "succeeded";
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Lỗi tải đánh giá";
        state.status = "failed";
      })

      .addCase(createReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state, action: PayloadAction<Review>) => {
        state.loading = false;
        state.reviews.push(action.payload);
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Lỗi tạo đánh giá";
      })

      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action: PayloadAction<{ _id: string }>) => {
        state.loading = false;
        state.reviews = state.reviews.filter(
          (r) => r._id !== action.payload._id
        );
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Lỗi xóa đánh giá";
      });
  },
});

export default reviewSlice.reducer;
