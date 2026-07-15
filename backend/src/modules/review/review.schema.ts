import { z } from "zod";

export const createReviewSchema = z.object({
  body: z.object({
    rating: z.number({ required_error: "Vui lòng chọn số sao đánh giá !" }).min(1).max(5),
    comment: z.string({ required_error: "Vui lòng viết nhận xét !" }).min(1, "Nhận xét không được bỏ trống"),
  }),
  params: z.object({
    productId: z.string({ required_error: "productId is required" }).min(24, "Invalid ObjectId").max(24, "Invalid ObjectId"),
  })
});

export const getReviewsSchema = z.object({
  params: z.object({
    productId: z.string({ required_error: "productId is required" }).min(24, "Invalid ObjectId").max(24, "Invalid ObjectId"),
  })
});

export const deleteReviewSchema = z.object({
  params: z.object({
    id: z.string({ required_error: "review id is required" }).min(24, "Invalid ObjectId").max(24, "Invalid ObjectId"),
  })
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>["body"];
