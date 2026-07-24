import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authReducer from './slices/authSlice';
import productsReducer from './slices/productsSlice';
import cartReducer from './slices/cartSlice';
import checkoutReducer from './slices/checkoutSlice';
import orderReducer from './slices/orderSlice';
import adminReducer from './slices/adminSlice';
import adminProductReducer from './slices/adminProductSlice';
import adminOrdersReducer from './slices/adminOrderSlice';
import reviewReducer from './slices/reviewSlice';
import wishlistReducer from './slices/wishlistSlice';
import couponAdminReducer from './slices/couponAdminSlice';
import couponUserReducer from "./slices/couponUserSlice";
import aiReducer from "./slices/aiSlice";
import bannerReducer from "./slices/bannerSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    cart: cartReducer,
    checkout: checkoutReducer,
    orders: orderReducer,
    admin: adminReducer,
    adminProducts: adminProductReducer,
    adminOrders: adminOrdersReducer,
    reviews: reviewReducer,
    wishList: wishlistReducer,
    coupon: couponAdminReducer,
    couponUser: couponUserReducer,
    ai: aiReducer,
    banners: bannerReducer,
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
