import { AsyncStatus } from './common';

export type PaymentMethod = 'Paypal' | 'COD' | string;
export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | string;
export type PaymentStatus = 'Pending' | 'Paid' | 'Failed' | string;

export interface ShippingAddress {
  address: string;
  city: string;
  postalCode?: string;
  country: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface OrderItem {
  productId?: string;
  _id?: string;
  name: string;
  image: string;
  price: number;
  size?: string;
  color?: string;
  quantity: number;
}

export interface OrderUser {
  _id: string;
  name: string;
  email: string;
}

export type CheckoutItem = OrderItem;

export interface Order {
  _id: string;
  user?: OrderUser;
  orderItems: OrderItem[];
  checkoutItems?: OrderItem[];
  shippingAddress: ShippingAddress;
  shippingMethod?: string;
  paymentMethod: PaymentMethod;
  totalPrice: number;
  subtotal?: number;
  discountAmount?: number;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface OrderState {
  orders: Order[];
  orderDetails: Order | null;
  loading: boolean;
  error: string | null;
  totalOrders: number;
  status: AsyncStatus;
}

export interface AdminOrderState {
  orders: Order[];
  totalOrders: number;
  totalSales: number;
  loading: boolean;
  error: string | null;
}

export interface CreateOrderPayload {
  orderItems?: OrderItem[];
  checkoutItems?: unknown[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  totalPrice: number;
  couponId?: string;
  couponCode?: string;
}

export interface UpdateOrderStatusPayload {
  orderId: string;
  status: OrderStatus;
}
