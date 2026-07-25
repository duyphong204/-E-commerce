import apiClient from '@/shared/api/api-client';
import { Product } from '../schemas/product.schema';

export async function createProduct(productData: Partial<Product>): Promise<Product> {
  const { data } = await apiClient.post<Product>('/api/admin/products', productData);
  return data;
}

export async function updateProduct({ id, ...productData }: Partial<Product> & { id: string }): Promise<Product> {
  const { data } = await apiClient.put<Product>(`/api/admin/products/${id}`, productData);
  return data;
}

export async function deleteProduct(id: string): Promise<string> {
  await apiClient.delete(`/api/admin/products/${id}`);
  return id;
}
