export type UserRole = 'admin' | 'customer';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type AsyncStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalProducts?: number;
  totalOrders?: number;
  totalUsers?: number;
  totalBanners?: number;
  totalCoupons?: number;
  limit?: number;
}

export interface ApiMeta {
  page?: number;
  pages?: number;
  total?: number;
  limit?: number;
  [key: string]: unknown;
}

export interface ApiResponse<T> {
  success?: boolean;
  data: T;
  message?: string;
  meta?: ApiMeta;
}

export interface BaseError {
  message: string;
  code?: string | number;
  details?: unknown;
}

export interface ChatMessage {
  from: 'user' | 'bot';
  text: string;
}

export interface SelectOption<T = string> {
  label: string;
  value: T;
}

// Re-export specific feature types that are used globally in user-facing components
export * from '@/features/auth/types/auth.types';
export * from '@/features/products/types/product.types';
export * from '@/features/cart/types/cart.types';
export * from '@/features/orders/types/order.types';
export * from '@/features/coupons/types/coupon.types';
export * from '@/features/banners/types/banner.types';
export * from '@/features/admin-dashboard/types/admin-dashboard.types';
export * from '@/features/accounts/types/account.types';
