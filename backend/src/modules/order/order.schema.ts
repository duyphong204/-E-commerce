import { z } from "zod";

export const getOrderByIdSchema = z.object({
  params: z.object({
    id: z.string({ required_error: "id is required" }).min(24, "Invalid Order ID").max(24, "Invalid Order ID"),
  })
});

export const updateOrderStatusSchema = z.object({
  params: z.object({
    id: z.string({ required_error: "id is required" }).min(24, "Invalid Order ID").max(24, "Invalid Order ID"),
  }),
  body: z.object({
    status: z.enum(["Processing", "Shipped", "Delivered", "Cancelled"], {
      required_error: "status is required",
    }),
  })
});

export const deleteOrderSchema = z.object({
  params: z.object({
    id: z.string({ required_error: "id is required" }).min(24, "Invalid Order ID").max(24, "Invalid Order ID"),
  })
});

export const getAllOrdersQuerySchema = z.object({
  query: z.object({
    page: z.string().optional().transform((val) => (val ? parseInt(val) : 1)),
    limit: z.string().optional().transform((val) => (val ? parseInt(val) : 10)),
  })
});

export const searchOrdersQuerySchema = z.object({
  query: z.object({
    term: z.string({ required_error: "term is required" }).min(1, "term cannot be empty"),
    page: z.string().optional().transform((val) => (val ? parseInt(val) : 1)),
    limit: z.string().optional().transform((val) => (val ? parseInt(val) : 10)),
  })
});
