export * from '../schemas/product.schema';
import { Product } from '../schemas/product.schema';
import { AsyncStatus, PaginationMeta } from '@/types';

export type GenderCategory = 'Men' | 'Women' | 'Unisex' | string;

export interface ProductImage {
  url: string;
  altText?: string;
  _id?: string;
}

export interface ProductFilters {
  collection?: string;
  category?: string;
  gender?: string;
  color?: string;
  size?: string;
  minPrice?: number | string;
  maxPrice?: number | string;
  sortBy?: string;
  search?: string;
  page?: number;
  limit?: number;
  material?: string | string[];
  brand?: string | string[];
}

export interface ProductsState {
  products: Product[];
  selectedProduct: Product | null;
  similarProducts: Product[];
  newArrivals: Product[];
  bestSellers: Product[];
  filters: ProductFilters;
  loading: boolean;
  error: string | null;
  pagination: PaginationMeta;
  status: AsyncStatus;
}

export interface AdminProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  totalProducts: number;
}

export interface CreateProductPayload {
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  countInStock: number;
  sku: string;
  category: string;
  brand?: string;
  sizes: string[];
  colors: string[];
  collections?: string;
  material?: string;
  gender?: string;
  images?: ProductImage[];
  isFeatured?: boolean;
  isPublished?: boolean;
}

export interface UpdateProductPayload extends Partial<CreateProductPayload> {
  id: string;
}

export interface FetchProductsResponse {
  products: Product[];
  page: number;
  totalPages: number;
  totalItems: number;
}

export interface AdminProductsResponse {
  products: Product[];
  page: number;
  totalPages: number;
  totalItems: number;
  statistics: {
    activeCount: number;
    lowStockCount: number;
  };
}

export interface ReviewUser {
  _id: string;
  name: string;
  avatar?: string;
}

export interface Review {
  _id: string;
  user: ReviewUser;
  product: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ReviewState {
  reviews: Review[];
  loading: boolean;
  error: string | null;
  status: AsyncStatus;
}

export interface CreateReviewPayload {
  productId: string;
  rating: number;
  comment: string;
}

export interface WishlistItem {
  _id: string;
  product: Product;
  addedAt?: string;
}

export interface WishlistState {
  wishlist: WishlistItem[];
  loading: boolean;
  error: string | null;
}
