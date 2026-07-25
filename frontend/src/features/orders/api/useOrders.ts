import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyOrders, getOrderDetails, getAdminOrders } from './getOrders';
import { updateOrderStatus, deleteOrder } from './orderMutations';
import { FetchAdminOrdersParams, UpdateOrderStatusPayload } from '../types/order.types';

export function useMyOrders() {
  return useQuery({
    queryKey: ['my-orders'],
    queryFn: ({ signal }) => getMyOrders(signal),
  });
}

export function useOrderDetails(orderId: string) {
  return useQuery({
    queryKey: ['order-details', orderId],
    queryFn: ({ signal }) => getOrderDetails(orderId, signal),
    enabled: Boolean(orderId),
  });
}

export function useAdminOrders(params: FetchAdminOrdersParams = {}) {
  return useQuery({
    queryKey: ['admin-orders', params.term || '', params.page || 1, params.limit || 10],
    queryFn: ({ signal }) => getAdminOrders(params, signal),
  });
}

export function useOrderMutations() {
  const queryClient = useQueryClient();

  const updateStatusMutation = useMutation({
    mutationFn: (payload: UpdateOrderStatusPayload) => updateOrderStatus(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['order-details'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    },
  });

  return {
    updateOrderStatus: updateStatusMutation.mutateAsync,
    isUpdatingStatus: updateStatusMutation.isPending,
    deleteOrder: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
