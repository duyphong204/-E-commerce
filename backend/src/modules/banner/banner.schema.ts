import { z } from "zod";

export const createBannerSchema = z.object({
  body: z.object({
    imageUrl: z.string({ required_error: "imageUrl is required" }).trim().min(1, "imageUrl cannot be empty"),
    title: z.string({ required_error: "title is required" }).trim().min(1, "title cannot be empty"),
    altText: z.string().optional(),
    order: z.number().int().default(0),
    isActive: z.boolean().default(true),
  })
});

export const updateBannerSchema = z.object({
  body: createBannerSchema.shape.body.partial()
});

export type CreateBannerInput = z.infer<typeof createBannerSchema>["body"];
export type UpdateBannerInput = z.infer<typeof updateBannerSchema>["body"];
