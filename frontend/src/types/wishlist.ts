import { Product } from './product';

export interface WishlistItem {
  _id: string;
  product: Product;
  addedAt?: string;
}

export interface WishlistState {
  wishlist: WishlistItem[];
  loading: boolean;
  error: string | null;
}
