import apiClient from '@/shared/api/api-client';
import { Cart, AddToCartPayload, UpdateCartItemPayload, RemoveFromCartPayload } from '@/types';

export async function getCartApi(params: { userId?: string; guestId?: string }, signal?: AbortSignal): Promise<Cart> {
  const { data } = await apiClient.get<Cart>('/api/cart', { params, signal });
  return data;
}

export async function addToCartApi(payload: AddToCartPayload): Promise<Cart> {
  const { data } = await apiClient.post<Cart>('/api/cart', payload);
  return data;
}

export async function updateCartItemApi(payload: UpdateCartItemPayload): Promise<Cart> {
  const { data } = await apiClient.put<Cart>('/api/cart', payload);
  return data;
}

export async function removeFromCartApi(payload: RemoveFromCartPayload): Promise<Cart> {
  const { data } = await apiClient.delete<Cart>('/api/cart', { data: payload });
  return data;
}

export async function mergeCartApi(guestId: string): Promise<Cart> {
  const { data } = await apiClient.post<Cart>('/api/cart/merge', { guestId });
  return data;
}
