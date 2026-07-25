import apiClient from '@/shared/api/api-client';
import { Coupon, CreateCouponPayload, UpdateCouponPayload } from '@/types';

export async function getCouponsApi(signal?: AbortSignal): Promise<Coupon[]> {
  const { data } = await apiClient.get<Coupon[]>('/api/coupons', { signal });
  return data;
}

export async function createCouponApi(payload: CreateCouponPayload): Promise<Coupon> {
  const { data } = await apiClient.post<Coupon>('/api/coupons', payload);
  return data;
}

export async function updateCouponApi({ id, ...payload }: UpdateCouponPayload): Promise<Coupon> {
  const { data } = await apiClient.put<Coupon>(`/api/coupons/${id}`, payload);
  return data;
}

export async function deleteCouponApi(id: string): Promise<string> {
  await apiClient.delete(`/api/coupons/${id}`);
  return id;
}

export async function toggleCouponStatusApi(id: string): Promise<Coupon> {
  const { data } = await apiClient.patch<Coupon>(`/api/coupons/${id}/toggle`);
  return data;
}
