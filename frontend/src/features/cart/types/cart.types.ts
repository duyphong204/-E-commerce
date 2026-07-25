import { AsyncStatus } from '@/types';

export interface CartItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
  countInStock?: number;
  sku?: string;
  discountPrice?: number;
}

export interface Cart {
  _id?: string;
  user?: string;
  guestId?: string;
  products: CartItem[];
  totalPrice: number;
}

export interface CartState {
  cart: Cart;
  loading: boolean;
  error: string | null;
  status: AsyncStatus;
}

export interface AddToCartPayload {
  productId: string;
  size: string;
  color: string;
  quantity: number;
  guestId?: string;
  userId?: string;
}

export interface UpdateCartItemPayload {
  productId: string;
  size: string;
  color: string;
  quantity: number;
  guestId?: string;
  userId?: string;
}

export interface RemoveFromCartPayload {
  productId: string;
  size: string;
  color: string;
  guestId?: string;
  userId?: string;
}
