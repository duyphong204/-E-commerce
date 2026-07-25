import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getProducts,
  getProductDetails,
  getSimilarProducts,
  getBestSellerProducts,
  getNewArrivalsProducts,
  getAdminProducts,
} from './getProducts';
import { createProduct, updateProduct, deleteProduct } from './productMutations';
import { Product } from '../schemas/product.schema';
import { ProductFilters } from '../types/product.types';

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: ({ signal }) => getProducts(filters, signal),
  });
}

export function useProductDetail(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: ({ signal }) => getProductDetails(id, signal),
    enabled: Boolean(id),
  });
}

export function useSimilarProducts(id: string) {
  return useQuery({
    queryKey: ['similar-products', id],
    queryFn: ({ signal }) => getSimilarProducts(id, signal),
    enabled: Boolean(id),
  });
}

export function useBestSellers() {
  return useQuery({
    queryKey: ['best-sellers'],
    queryFn: ({ signal }) => getBestSellerProducts(signal),
  });
}

export function useNewArrivals() {
  return useQuery({
    queryKey: ['new-arrivals'],
    queryFn: ({ signal }) => getNewArrivalsProducts(signal),
  });
}

export function useAdminProducts(params: { page?: number; limit?: number; term?: string } = {}) {
  return useQuery({
    queryKey: ['admin-products', params.term || '', params.page || 1, params.limit || 10],
    queryFn: ({ signal }) => getAdminProducts(params, signal),
  });
}

export function useProductMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Product> & { id: string }) => updateProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
  });

  return {
    createProduct: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateProduct: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteProduct: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
