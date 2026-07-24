import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "../../utils/axiosConfig";
import { User, AuthState, LoginPayload, RegisterPayload } from "../../types";

const API_URL = import.meta.env.VITE_API_URL || "";

const userInfoFromStorage: User | null = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo") as string)
  : null;

const initialGuestId =
  localStorage.getItem("guestId") || `guest_${new Date().getTime()}`;
localStorage.setItem("guestId", initialGuestId);

const initialState: AuthState = {
  user: userInfoFromStorage,
  userToken: localStorage.getItem("userToken"),
  status: "idle",
  guestId: initialGuestId,
  loading: false,
  error: null,
};

const clearUserDataState = (state: AuthState): void => {
  state.user = null;
  state.userToken = null;
  state.guestId = `guest_${new Date().getTime()}`;
  localStorage.removeItem("userInfo");
  localStorage.removeItem("userToken");
  localStorage.setItem("guestId", state.guestId);
};

export const loginUser = createAsyncThunk<
  User,
  LoginPayload,
  { rejectValue: { message: string } }
>(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post<{ user: User; accessToken?: string }>(
        `${API_URL}/api/users/login`,
        userData
      );

      if (!res.data.accessToken) throw new Error("Không nhận được access token");

      localStorage.setItem("userInfo", JSON.stringify(res.data.user));
      localStorage.setItem("userToken", res.data.accessToken);

      return res.data.user;
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      const message =
        errorObj.response?.data?.message || errorObj.message || "Đăng nhập thất bại";
      return rejectWithValue({ message });
    }
  }
);

export const registerUser = createAsyncThunk<
  User,
  RegisterPayload,
  { rejectValue: { message: string } }
>(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post<{ user: User; accessToken?: string }>(
        `${API_URL}/api/users/register`,
        userData
      );

      if (!res.data.accessToken) throw new Error("Không nhận được access token");

      localStorage.setItem("userInfo", JSON.stringify(res.data.user));
      localStorage.setItem("userToken", res.data.accessToken);

      return res.data.user;
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
      const message =
        errorObj.response?.data?.message || errorObj.message || "Đăng ký thất bại";
      return rejectWithValue({ message });
    }
  }
);

export const logoutUserAsync = createAsyncThunk<
  boolean,
  void,
  { rejectValue: { message: string } }
>(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await axios.post(`${API_URL}/api/users/logout`);
      return true;
    } catch {
      return rejectWithValue({ message: "Logout failed" });
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutUser: clearUserDataState,
    generateNewGuestId: (state) => {
      state.guestId = `guest_${new Date().getTime()}`;
      localStorage.setItem("guestId", state.guestId);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.status = "succeeded";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Đăng nhập thất bại";
        state.status = "failed";
      })

      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading";
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.status = "succeeded";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Đăng ký thất bại";
        state.status = "failed";
      })

      .addCase(logoutUserAsync.fulfilled, clearUserDataState);
  },
});

export const { logoutUser, generateNewGuestId } = authSlice.actions;
export default authSlice.reducer;
