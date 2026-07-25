import apiClient from '@/shared/api/api-client';
import { Order } from '@/types';
import { AdminOrdersResponse, FetchAdminOrdersParams } from '../types/order.types';

export async function getMyOrders(signal?: AbortSignal): Promise<Order[]> {
  const { data } = await apiClient.get<Order[]>('/api/orders/my-orders', { signal });
  return data;
}

export async function getOrderDetails(orderId: string, signal?: AbortSignal): Promise<Order> {
  const { data } = await apiClient.get<Order>(`/api/orders/${orderId}`, { signal });
  return data;
}

export async function getAdminOrders(params: FetchAdminOrdersParams = {}, signal?: AbortSignal): Promise<AdminOrdersResponse> {
  const endpoint = params.term ? '/api/admin/orders/search' : '/api/admin/orders';
  const { data } = await apiClient.get<AdminOrdersResponse>(endpoint, {
    params: {
      term: params.term,
      page: params.page || 1,
      limit: params.limit || 10,
    },
    signal,
  });
  return data;
}
