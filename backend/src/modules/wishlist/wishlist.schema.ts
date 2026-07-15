import { z } from "zod";

export const wishlistParamSchema = z.object({
  params: z.object({
    productId: z.string({ required_error: "productId is required" }).min(24, "Invalid ObjectId").max(24, "Invalid ObjectId"),
  })
});
