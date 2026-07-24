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

export interface SelectOption<T = string> {
  label: string;
  value: T;
}
