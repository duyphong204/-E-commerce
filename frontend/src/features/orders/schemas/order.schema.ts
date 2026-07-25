import { z } from 'zod';

export const OrderStatusSchema = z.enum([
  'Pending',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
]);

// OrderStatus type is exported from types/order.types.ts
