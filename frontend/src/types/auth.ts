import { AsyncStatus } from './common';

export type UserRole = 'admin' | 'customer';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthState {
  user: User | null;
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

export interface AuthResponse {
  user: User;
  token?: string;
  accessToken?: string;
}

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  password?: string;
}
