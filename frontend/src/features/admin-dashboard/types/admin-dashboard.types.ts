import { User } from '@/types';

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  lowStockProducts?: unknown[];
}

export interface SalesChartData {
  _id: string;
  date?: string;
  sales: number;
  count?: number;
}

export interface TopSellingProduct {
  _id: string;
  name: string;
  image?: string;
  totalSold: number;
  revenue?: number;
}

export interface LowStockProduct {
  _id: string;
  name: string;
  images?: { url: string }[];
  countInStock: number;
}

export interface TopWishlistProduct {
  _id: string;
  name: string;
  image?: string;
  count: number;
}

export interface AdminState {
  users: User[];
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
}

export interface AdminDashboardFullStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts?: number;
  totalUsers: number;
  salesData: SalesChartData[];
  topSellingProducts: TopSellingProduct[];
  lowStockProducts: LowStockProduct[];
  topWishlistProducts: TopWishlistProduct[];
}

export type TimeRange = 'daily' | 'monthly' | 'yearly';
