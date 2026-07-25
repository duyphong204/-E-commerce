import apiClient from '@/shared/api/api-client';
import { Coupon, CreateCouponPayload, UpdateCouponPayload } from '@/types';

export async function getCouponsApi(signal?: AbortSignal): Promise<Coupon[]> {
  const { data } = await apiClient.get<Coupon[]>('/api/admin/coupons', { signal });
  return data;
}

export async function createCouponApi(payload: CreateCouponPayload): Promise<Coupon> {
  const { data } = await apiClient.post<Coupon>('/api/admin/coupons', payload);
  return data;
}

export async function updateCouponApi({ id, ...payload }: UpdateCouponPayload): Promise<Coupon> {
  const { data } = await apiClient.put<Coupon>(`/api/admin/coupons/${id}`, payload);
  return data;
}

export async function deleteCouponApi(id: string): Promise<string> {
  await apiClient.delete(`/api/admin/coupons/${id}`);
  return id;
}

export async function toggleCouponStatusApi(id: string): Promise<Coupon> {
  const { data } = await apiClient.patch<Coupon>(`/api/admin/coupons/${id}/toggle`);
  return data;
}

export async function validateCouponApi(payload: { code: string; userId: string; totalPrice: number }): Promise<{
  couponId: string;
  code: string;
  discountAmount: number;
  finalTotal: number;
  message: string;
}> {
  const { data } = await apiClient.post('/api/coupons/validate', payload);
  return data;
}
