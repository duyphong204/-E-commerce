import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCheckoutApi, payCheckoutApi, finalizeCheckoutApi } from './checkoutApi';

export function useCheckoutMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createCheckoutApi,
  });

  const payMutation = useMutation({
    mutationFn: payCheckoutApi,
  });

  const finalizeMutation = useMutation({
    mutationFn: finalizeCheckoutApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
    },
  });

  return {
    createCheckout: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    payCheckout: payMutation.mutateAsync,
    isPaying: payMutation.isPending,
    finalizeCheckout: finalizeMutation.mutateAsync,
    isFinalizing: finalizeMutation.isPending,
  };
}
