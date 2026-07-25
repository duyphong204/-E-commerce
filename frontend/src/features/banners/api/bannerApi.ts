import apiClient from '@/shared/api/api-client';
import { Banner } from '@/types';

export async function getBannersApi(signal?: AbortSignal): Promise<Banner[]> {
  const { data } = await apiClient.get<Banner[]>('/api/banners', { signal });
  return data;
}

export async function getAdminBannersApi(signal?: AbortSignal): Promise<Banner[]> {
  const { data } = await apiClient.get<Banner[]>('/api/banners/admin', { signal });
  return data;
}

export async function createBannerApi(bannerData: FormData | Partial<Banner>): Promise<{ banner: Banner }> {
  const { data } = await apiClient.post<{ banner: Banner }>('/api/banners', bannerData);
  return data;
}

export async function updateBannerApi(id: string, bannerData: FormData | Partial<Banner>): Promise<{ banner: Banner }> {
  const { data } = await apiClient.put<{ banner: Banner }>(`/api/banners/${id}`, bannerData);
  return data;
}

export async function deleteBannerApi(id: string): Promise<string> {
  await apiClient.delete(`/api/banners/${id}`);
  return id;
}

export async function toggleBannerStatusApi(id: string): Promise<{ banner: Banner }> {
  const { data } = await apiClient.patch<{ banner: Banner }>(`/api/banners/${id}/toggle`);
  return data;
}
