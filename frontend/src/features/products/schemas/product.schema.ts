import { z } from 'zod';

export const ProductImageSchema = z.object({
  url: z.string(),
  altText: z.string().optional(),
});

export const ProductColorSchema = z.object({
  name: z.string(),
  hex: z.string().optional(),
});

export const ProductSchema = z.object({
  _id: z.string(),
  name: z.string().min(2, 'Tên sản phẩm phải có ít nhất 2 ký tự'),
  description: z.string().optional(),
  price: z.number().min(0, 'Giá sản phẩm phải lớn hơn hoặc bằng 0'),
  discountPrice: z.number().optional(),
  countInStock: z.number().min(0, 'Số lượng trong kho phải lớn hơn hoặc bằng 0'),
  sku: z.string().optional(),
  category: z.string(),
  brand: z.string().optional(),
  sizes: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
  images: z.array(ProductImageSchema).optional(),
  collections: z.string().optional(),
  material: z.string().optional(),
  gender: z.string().optional(),
  isFeatured: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  isBestSeller: z.boolean().optional(),
  rating: z.number().optional(),
  numReviews: z.number().optional(),
  createdAt: z.string().optional(),
});

export const ProductFiltersSchema = z.object({
  category: z.string().optional(),
  size: z.string().optional(),
  color: z.string().optional(),
  gender: z.string().optional(),
  brand: z.string().optional(),
  minPrice: z.union([z.string(), z.number()]).optional(),
  maxPrice: z.union([z.string(), z.number()]).optional(),
  sortBy: z.string().optional(),
  search: z.string().optional(),
  material: z.string().optional(),
  collection: z.string().optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

export type Product = z.infer<typeof ProductSchema>;
// ProductFilters is exported from types/product.types.ts
