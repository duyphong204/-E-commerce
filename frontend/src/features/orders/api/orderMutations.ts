import apiClient from '@/shared/api/api-client';
import { Order } from '@/types';
import { UpdateOrderStatusPayload } from '../types/order.types';

export async function updateOrderStatus({ id, status }: UpdateOrderStatusPayload): Promise<Order> {
  const { data } = await apiClient.put<Order>(`/api/admin/orders/${id}`, { status });
  return data;
}

export async function deleteOrder(id: string): Promise<string> {
  await apiClient.delete(`/api/admin/orders/${id}`);
  return id;
}
