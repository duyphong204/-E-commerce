import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCartApi, addToCartApi, updateCartItemApi, removeFromCartApi, mergeCartApi } from './cartApi';
import { AddToCartPayload, UpdateCartItemPayload, RemoveFromCartPayload } from '@/types';

export function useCart(params: { userId?: string; guestId?: string } = {}) {
  return useQuery({
    queryKey: ['cart', params.userId || '', params.guestId || ''],
    queryFn: ({ signal }) => getCartApi(params, signal),
  });
}

export function useCartMutations() {
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: (payload: AddToCartPayload) => addToCartApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: UpdateCartItemPayload) => updateCartItemApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (payload: RemoveFromCartPayload) => removeFromCartApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const mergeMutation = useMutation({
    mutationFn: (guestId: string) => mergeCartApi(guestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  return {
    addToCart: addMutation.mutateAsync,
    isAdding: addMutation.isPending,
    updateCartItem: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    removeFromCart: removeMutation.mutateAsync,
    isRemoving: removeMutation.isPending,
    mergeCart: mergeMutation.mutateAsync,
    isMerging: mergeMutation.isPending,
  };
}
