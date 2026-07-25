import { AsyncStatus } from '@/types';

export interface Banner {
  _id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkUrl?: string;
  link?: string;
  altText?: string;
  isActive: boolean;
  order?: number;
  createdAt?: string;
}

export interface BannerState {
  banners: Banner[];
  loading: boolean;
  error: string | null;
  status: AsyncStatus;
}

export interface CreateBannerPayload {
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkUrl?: string;
  link?: string;
  altText?: string;
  isActive?: boolean;
  order?: number;
}
