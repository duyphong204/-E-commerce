import apiClient from '@/shared/api/api-client';
import { LoginInput, RegisterInput, AuthUser } from '../schemas/auth.schema';
import { AuthResponse } from '../types/auth.types';

export async function loginApi(credentials: LoginInput): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/api/users/login', credentials);
  return data;
}

export async function registerApi(input: RegisterInput): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/api/users/register', input);
  return data;
}

export async function getProfileApi(signal?: AbortSignal): Promise<AuthUser> {
  const { data } = await apiClient.get<AuthUser>('/api/users/profile', { signal });
  return data;
}
