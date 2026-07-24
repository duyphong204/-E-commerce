import { AsyncStatus } from './common';

export interface ReviewUser {
  _id: string;
  name: string;
  avatar?: string;
}

export interface Review {
  _id: string;
  user: ReviewUser;
  product: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ReviewState {
  reviews: Review[];
  loading: boolean;
  error: string | null;
  status: AsyncStatus;
}

export interface CreateReviewPayload {
  productId: string;
  rating: number;
  comment: string;
}
