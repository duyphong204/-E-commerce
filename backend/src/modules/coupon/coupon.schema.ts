import { z } from "zod";

export const validateCouponSchema = z.object({
  body: z.object({
    code: z.string({ required_error: "Code is required" }).min(1, "Code cannot be empty"),
    userId: z.string({ required_error: "userId is required" }).min(24, "Invalid user ID").max(24, "Invalid user ID"),
    totalPrice: z.number({ required_error: "totalPrice is required" }).nonnegative(),
  })
});

export const applyCouponSchema = z.object({
  body: z.object({
    couponId: z.string({ required_error: "couponId is required" }).min(24, "Invalid coupon ID").max(24, "Invalid coupon ID"),
    userId: z.string({ required_error: "userId is required" }).min(24, "Invalid user ID").max(24, "Invalid user ID"),
    orderId: z.string({ required_error: "orderId is required" }).min(24, "Invalid order ID").max(24, "Invalid order ID"),
  })
});

export const createCouponSchema = z.object({
  body: z.object({
    code: z.string({ required_error: "Code is required" }).trim().toUpperCase().min(1, "Code cannot be empty"),
    description: z.string().optional(),
    discountType: z.enum(["percent", "fixed"], { required_error: "discountType is required" }),
    discountValue: z.number({ required_error: "discountValue is required" }).positive(),
    minOrderValue: z.number().nonnegative().default(0),
    maxDiscountValue: z.number().positive().optional(),
    startDate: z.string({ required_error: "startDate is required" }).refine((val) => !isNaN(Date.parse(val)), "Invalid startDate"),
    endDate: z.string({ required_error: "endDate is required" }).refine((val) => !isNaN(Date.parse(val)), "Invalid endDate"),
    usageLimit: z.number().int().nonnegative().default(0),
    isActive: z.boolean().default(true),
  })
});

export const updateCouponSchema = z.object({
  body: createCouponSchema.shape.body.partial()
});

export type CreateCouponInput = z.infer<typeof createCouponSchema>["body"];
export type UpdateCouponInput = z.infer<typeof updateCouponSchema>["body"];
