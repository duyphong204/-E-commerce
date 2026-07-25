import apiClient from '@/shared/api/api-client';
import { Product } from '../schemas/product.schema';
import { FetchProductsResponse, AdminProductsResponse, ProductFilters } from '../types/product.types';

export async function getProducts(filters: ProductFilters = {}, signal?: AbortSignal): Promise<FetchProductsResponse> {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, String(value));
    }
  }

  const { data } = await apiClient.get<FetchProductsResponse>(`/api/products/filters?${query.toString()}`, {
    signal,
  });
  return data;
}

export async function getProductDetails(id: string, signal?: AbortSignal): Promise<Product> {
  const { data } = await apiClient.get<Product>(`/api/products/${id}`, { signal });
  return data;
}

export async function getSimilarProducts(id: string, signal?: AbortSignal): Promise<Product[]> {
  const { data } = await apiClient.get<Product[]>(`/api/products/similar/${id}`, { signal });
  return data;
}

export async function getBestSellerProducts(signal?: AbortSignal): Promise<Product[]> {
  const { data } = await apiClient.get<Product[]>(`/api/products/best-seller`, { signal });
  return data;
}

export async function getNewArrivalsProducts(signal?: AbortSignal): Promise<Product[]> {
  const { data } = await apiClient.get<Product[]>(`/api/products/new-arrivals`, { signal });
  return data;
}

export async function getAdminProducts(params: { page?: number; limit?: number; term?: string } = {}, signal?: AbortSignal): Promise<AdminProductsResponse> {
  const endpoint = params.term ? '/api/admin/products/search' : '/api/admin/products';
  const { data } = await apiClient.get<AdminProductsResponse>(endpoint, {
    params: {
      term: params.term,
      page: params.page || 1,
      limit: params.limit || 10,
    },
    signal,
  });
  return data;
}
