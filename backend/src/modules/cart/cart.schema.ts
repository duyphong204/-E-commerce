import { z } from "zod";

export const addCartItemSchema = z.object({
  body: z.object({
    productId: z.string({ required_error: "productId is required" }),
    quantity: z.number({ required_error: "quantity is required" }).int().positive(),
    size: z.string().optional(),
    color: z.string().optional(),
    guestId: z.string().optional(),
    userId: z.string().optional(),
  })
});

export const updateCartItemSchema = z.object({
  body: z.object({
    productId: z.string({ required_error: "productId is required" }),
    quantity: z.number({ required_error: "quantity is required" }).int().nonnegative(),
    size: z.string().optional(),
    color: z.string().optional(),
    guestId: z.string().optional(),
    userId: z.string().optional(),
  })
});

export const removeCartItemSchema = z.object({
  body: z.object({
    productId: z.string({ required_error: "productId is required" }),
    size: z.string().optional(),
    color: z.string().optional(),
    guestId: z.string().optional(),
    userId: z.string().optional(),
  })
});

export const mergeCartSchema = z.object({
  body: z.object({
    guestId: z.string({ required_error: "guestId is required" }),
  })
});

export const getCartSchema = z.object({
  query: z.object({
    userId: z.string().optional(),
    guestId: z.string().optional(),
  })
});

export type AddCartItemInput = z.infer<typeof addCartItemSchema>["body"];
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>["body"];
export type RemoveCartItemInput = z.infer<typeof removeCartItemSchema>["body"];
export type MergeCartInput = z.infer<typeof mergeCartSchema>["body"];
