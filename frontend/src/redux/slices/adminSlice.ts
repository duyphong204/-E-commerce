import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "../../utils/axiosConfig";
import { User, UserRole } from "../../types";

const API_URL = import.meta.env.VITE_API_URL || "";

export interface FetchUsersParams {
  page?: number;
  limit?: number;
}

export interface SearchUsersParams extends FetchUsersParams {
  term: string;
}

export interface UsersResponse {
  results: User[];
  page: number;
  totalPages: number;
  totalItems: number;
  statistics: {
    adminCount: number;
    customerCount: number;
  };
}

export interface UpdateUserPayload {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface CreateAdminUserPayload {
  name: string;
  email: string;
  role: UserRole;
  password?: string;
}

export const fetchUsers = createAsyncThunk<
  UsersResponse,
  FetchUsersParams,
  { rejectValue: { message: string } }
>(
  "admin/fetchUsers",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<UsersResponse>(
        `${API_URL}/api/admin/users?page=${page}&limit=${limit}`
      );
      return data;
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      return rejectWithValue({
        message: errorObj.response?.data?.message || "Lỗi tải người dùng",
      });
    }
  }
);

export const searchUser = createAsyncThunk<
  UsersResponse,
  SearchUsersParams,
  { rejectValue: { message: string } }
>(
  "admin/searchUser",
  async ({ term, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get<UsersResponse>(
        `${API_URL}/api/admin/users/search?term=${term}&page=${page}&limit=${limit}`
      );
      return data;
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      return rejectWithValue({
        message: errorObj.response?.data?.message || "Không tìm thấy",
      });
    }
  }
);

export const addUser = createAsyncThunk<
  User,
  CreateAdminUserPayload,
  { rejectValue: { message: string } }
>(
  "admin/addUser",
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post<{ newUser: User }>(
        `${API_URL}/api/admin/users`,
        userData
      );
      return data.newUser;
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      return rejectWithValue({
        message: errorObj.response?.data?.message || "Thêm thất bại",
      });
    }
  }
);

export const updateUser = createAsyncThunk<
  User,
  UpdateUserPayload,
  { rejectValue: { message: string } }
>(
  "admin/updateUser",
  async ({ id, name, email, role }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put<User>(`${API_URL}/api/admin/users/${id}`, {
        name,
        email,
        role,
      });
      return data;
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      return rejectWithValue({
        message: errorObj.response?.data?.message || "Cập nhật thất bại",
      });
    }
  }
);

export const deleteUser = createAsyncThunk<
  string,
  string,
  { rejectValue: { message: string } }
>(
  "admin/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/api/admin/users/${id}`);
      return id;
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      return rejectWithValue({
        message: errorObj.response?.data?.message || "Xóa thất bại",
      });
    }
  }
);

export interface AdminSliceState {
  users: User[];
  page: number;
  totalPages: number;
  totalItems: number;
  statistics: {
    adminCount: number;
    customerCount: number;
  };
  loading: boolean;
  error: string | null;
}

const initialState: AdminSliceState = {
  users: [],
  page: 1,
  totalPages: 1,
  totalItems: 0,
  statistics: {
    adminCount: 0,
    customerCount: 0,
  },
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<UsersResponse>) => {
        state.loading = false;
        state.users = action.payload.results;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.totalItems = action.payload.totalItems;
        state.statistics = action.payload.statistics;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Lỗi tải người dùng";
      })

      .addCase(searchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchUser.fulfilled, (state, action: PayloadAction<UsersResponse>) => {
        state.loading = false;
        state.users = action.payload.results;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.totalItems = action.payload.totalItems;
        state.statistics = action.payload.statistics;
      })
      .addCase(searchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Lỗi tìm kiếm";
      })

      .addCase(addUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.users.unshift(action.payload);
        state.totalItems += 1;
      })

      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        const idx = state.users.findIndex((u) => u._id === action.payload._id);
        if (idx !== -1) state.users[idx] = action.payload;
      })

      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.users = state.users.filter((u) => u._id !== action.payload);
        state.totalItems -= 1;
      });
  },
});

export default adminSlice.reducer;
