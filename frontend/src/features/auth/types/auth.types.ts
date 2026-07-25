import { AuthUser } from '../schemas/auth.schema';
import { AsyncStatus } from '@/types';

export interface AuthResponse {
  user: AuthUser;
  token?: string;
  accessToken?: string;
  message?: string;
}

export interface AuthState {
  user: AuthUser | null;
  userToken: string | null;
  status: AsyncStatus;
  loading: boolean;
  error: string | null;
  guestId: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  password?: string;
}
