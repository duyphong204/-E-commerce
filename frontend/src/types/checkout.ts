import { Order, ShippingAddress, PaymentMethod } from './order';
import { AsyncStatus } from './common';

export interface CheckoutForm {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  paymentMethod: PaymentMethod;
}

export interface CheckoutState {
  checkout: Order | null;
  loading: boolean;
  error: string | null;
  status: AsyncStatus;
}
