import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "../../utils/axiosConfig";
import { Cart, CartState, AddToCartPayload, UpdateCartItemPayload, RemoveFromCartPayload } from "../../types";

const API_URL = import.meta.env.VITE_API_URL || "";

const loadCartFromStorage = (): Cart => {
  const storedCart = localStorage.getItem("cart");
  return storedCart ? JSON.parse(storedCart) : { products: [], totalPrice: 0 };
};

const saveCartToStorage = (cart: Cart): void => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

const initialState: CartState = {
  cart: loadCartFromStorage(),
  loading: false,
  error: null,
  status: "idle",
};

export const fetchCart = createAsyncThunk<
  Cart,
  { userId?: string; guestId?: string },
  { rejectValue: { message: string } }
>(
  "cart/fetchCart",
  async ({ userId, guestId }, { rejectWithValue }) => {
    try {
      const response = await axios.get<Cart>(`${API_URL}/api/cart`, {
        params: { userId, guestId },
      });
      return response.data;
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      return rejectWithValue({ message: errorObj.response?.data?.message || "Failed to fetch cart" });
    }
  }
);

export const addToCart = createAsyncThunk<
  Cart,
  AddToCartPayload,
  { rejectValue: { message: string } }
>(
  "cart/addToCart",
  async ({ productId, quantity, size, color, userId, guestId }, { rejectWithValue }) => {
    try {
      const response = await axios.post<Cart>(`${API_URL}/api/cart`, {
        productId,
        quantity,
        size,
        color,
        userId,
        guestId,
      });
      return response.data;
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      return rejectWithValue({ message: errorObj.response?.data?.message || "Failed to add item to cart" });
    }
  }
);

export const updateCartItemQuantity = createAsyncThunk<
  Cart,
  UpdateCartItemPayload,
  { rejectValue: { message: string } }
>(
  "cart/updateCartItemQuantity",
  async ({ productId, quantity, size, color, userId, guestId }, { rejectWithValue }) => {
    try {
      const response = await axios.put<Cart>(`${API_URL}/api/cart`, {
        productId,
        quantity,
        size,
        color,
        userId,
        guestId,
      });
      return response.data;
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      return rejectWithValue({ message: errorObj.response?.data?.message || "Failed to update item quantity" });
    }
  }
);

export const removeFromCart = createAsyncThunk<
  Cart,
  RemoveFromCartPayload,
  { rejectValue: { message: string } }
>(
  "cart/removeFromCart",
  async ({ productId, size, color, userId, guestId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete<Cart>(`${API_URL}/api/cart`, {
        data: { productId, size, color, userId, guestId },
      });
      return response.data;
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      return rejectWithValue({ message: errorObj.response?.data?.message || "Failed to remove item from cart" });
    }
  }
);

export const mergeCart = createAsyncThunk<
  Cart,
  { guestId: string; user?: unknown },
  { rejectValue: { message: string } }
>(
  "cart/mergeCart",
  async ({ guestId, user }, { rejectWithValue }) => {
    try {
      const response = await axios.post<Cart>(`${API_URL}/api/cart/merge`, { guestId });
      return response.data;
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      return rejectWithValue({ message: errorObj.response?.data?.message || "Failed to merge cart" });
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cart = { products: [], totalPrice: 0 };
      localStorage.removeItem("cart");
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state: CartState) => {
      state.loading = true;
      state.error = null;
      state.status = "loading";
    };

    const handleFulfilled = (state: CartState, action: PayloadAction<Cart>) => {
      state.loading = false;
      state.cart = action.payload;
      state.status = "succeeded";
      saveCartToStorage(action.payload);
    };

    builder
      .addCase(fetchCart.pending, handlePending)
      .addCase(fetchCart.fulfilled, handleFulfilled)
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch cart";
        state.status = "failed";
      })

      .addCase(addToCart.pending, handlePending)
      .addCase(addToCart.fulfilled, handleFulfilled)
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to add item to cart";
        state.status = "failed";
      })

      .addCase(updateCartItemQuantity.pending, handlePending)
      .addCase(updateCartItemQuantity.fulfilled, handleFulfilled)
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update item quantity";
        state.status = "failed";
      })

      .addCase(removeFromCart.pending, handlePending)
      .addCase(removeFromCart.fulfilled, handleFulfilled)
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to remove item from cart";
        state.status = "failed";
      })

      .addCase(mergeCart.pending, handlePending)
      .addCase(mergeCart.fulfilled, handleFulfilled)
      .addCase(mergeCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to merge cart";
        state.status = "failed";
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
