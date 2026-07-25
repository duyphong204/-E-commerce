import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCouponsApi,
  createCouponApi,
  updateCouponApi,
  deleteCouponApi,
  toggleCouponStatusApi,
  validateCouponApi,
} from './couponApi';
import { CreateCouponPayload, UpdateCouponPayload } from '@/types';

export function useCoupons() {
  return useQuery({
    queryKey: ['coupons'],
    queryFn: ({ signal }) => getCouponsApi(signal),
  });
}

export function useValidateCoupon() {
  return useMutation({
    mutationFn: validateCouponApi,
  });
}

export function useCouponMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (payload: CreateCouponPayload) => createCouponApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: UpdateCouponPayload) => updateCouponApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCouponApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: toggleCouponStatusApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
  });

  return {
    createCoupon: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateCoupon: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteCoupon: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    toggleCouponStatus: toggleMutation.mutateAsync,
    isToggling: toggleMutation.isPending,
  };
}
