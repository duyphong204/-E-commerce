import { AsyncStatus, PaginationMeta } from './common';

export type GenderCategory = 'Men' | 'Women' | 'Unisex' | string;

export interface ProductImage {
  url: string;
  altText?: string;
  _id?: string;
}

export interface Product {
  _id: string;
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
  collections: string;
  material?: string;
  gender?: GenderCategory;
  images: ProductImage[];
  isFeatured?: boolean;
  isPublished?: boolean;
  isBestSeller?: boolean;
  rating?: number;
  numReviews?: number;
  createdAt?: string;
  updatedAt?: string;
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
