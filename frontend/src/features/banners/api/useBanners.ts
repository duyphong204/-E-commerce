import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getBannersApi,
  getAdminBannersApi,
  createBannerApi,
  updateBannerApi,
  deleteBannerApi,
  toggleBannerStatusApi,
} from './bannerApi';
import { Banner } from '@/types';

export function useBanners() {
  return useQuery({
    queryKey: ['banners'],
    queryFn: ({ signal }) => getBannersApi(signal),
  });
}

export function useAdminBanners() {
  return useQuery({
    queryKey: ['admin-banners'],
    queryFn: ({ signal }) => getAdminBannersApi(signal),
  });
}

export function useBannerMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (bannerData: FormData | Partial<Banner>) => createBannerApi(bannerData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData | Partial<Banner> }) => updateBannerApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBannerApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: toggleBannerStatusApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
    },
  });

  return {
    createBanner: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateBanner: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteBanner: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    toggleBannerStatus: toggleMutation.mutateAsync,
    isToggling: toggleMutation.isPending,
  };
}
