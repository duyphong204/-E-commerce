import { z } from "zod";

const imageSchema = z.object({
  url: z.string({ required_error: "Image URL is required" }).url("Invalid URL"),
  altText: z.string().optional(),
});

export const createProductSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Name is required" }).trim().min(1, "Name cannot be empty"),
    description: z.string({ required_error: "Description is required" }),
    price: z.number({ required_error: "Price is required" }).positive("Price must be greater than 0"),
    discountPrice: z.number().optional(),
    countInStock: z.number({ required_error: "Stock count is required" }).nonnegative(),
    sku: z.string({ required_error: "SKU is required" }).trim(),
    category: z.enum(["Top Wear", "Bottom Wear", "Footwear", "Accessories"], {
      errorMap: () => ({ message: "Invalid category" }),
    }),
    brand: z.string({ required_error: "Brand is required" }),
    sizes: z.array(z.string()).nonempty("At least one size is required"),
    colors: z.array(z.string()).nonempty("At least one color is required"),
    images: z.array(imageSchema).nonempty("At least one image is required"),
    gender: z.enum(["Men", "Women"]).optional(),
    collections: z.string().optional(),
    material: z.string().optional(),
    status: z.enum(["active", "inactive", "out-of-stock"]).optional(),
    isFeatured: z.boolean().optional(),
    isPublished: z.boolean().optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    metaKeywords: z.string().optional(),
    dimensions: z.object({
      length: z.number().optional(),
      width: z.number().optional(),
      height: z.number().optional(),
    }).optional(),
    weight: z.number().optional(),
  })
});

export const updateProductSchema = z.object({
  body: createProductSchema.shape.body.partial()
});

export type CreateProductInput = z.infer<typeof createProductSchema>["body"];
export type UpdateProductInput = z.infer<typeof updateProductSchema>["body"];
