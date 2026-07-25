import apiClient from '@/shared/api/api-client';
import { Order } from '@/types';

export async function createCheckoutApi(payload: unknown): Promise<Order> {
  const { data } = await apiClient.post<Order>('/api/checkout', payload);
  return data;
}

export async function payCheckoutApi({ checkoutId, paymentDetails }: { checkoutId: string; paymentDetails: unknown }): Promise<Order> {
  const { data } = await apiClient.put<Order>(`/api/checkout/${checkoutId}/pay`, {
    paymentStatus: 'paid',
    paymentDetails,
  });
  return data;
}

export async function finalizeCheckoutApi(checkoutId: string): Promise<Order> {
  const { data } = await apiClient.post<Order>(`/api/checkout/${checkoutId}/finalize`);
  return data;
}
