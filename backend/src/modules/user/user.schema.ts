import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Name is required" }).min(2, "Name must be at least 2 characters"),
    email: z.string({ required_error: "Email is required" }).email("Invalid email format"),
    password: z.string({ required_error: "Password is required" }).min(6, "Password must be at least 6 characters"),
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string({ required_error: "Email is required" }).email("Invalid email format"),
    password: z.string({ required_error: "Password is required" })
  })
});

export const adminCreateUserSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Name is required" }).min(2),
    email: z.string({ required_error: "Email is required" }).email(),
    password: z.string({ required_error: "Password is required" }).min(6),
    role: z.enum(["admin", "customer"]).default("customer"),
  })
});

export const adminUpdateUserSchema = z.object({
  params: z.object({
    id: z.string().length(24, "Invalid user ID"),
  }),
  body: z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    role: z.enum(["admin", "customer"]).optional(),
    password: z.string().min(6).optional(),
  })
});

export const adminGetAllUsersQuerySchema = z.object({
  query: z.object({
    page: z.string().optional().transform((val) => (val ? parseInt(val) : 1)),
    limit: z.string().optional().transform((val) => (val ? parseInt(val) : 10)),
  })
});

export const adminSearchUserQuerySchema = z.object({
  query: z.object({
    term: z.string({ required_error: "term is required" }).min(1, "term cannot be empty"),
    page: z.string().optional().transform((val) => (val ? parseInt(val) : 1)),
    limit: z.string().optional().transform((val) => (val ? parseInt(val) : 10)),
  })
});

export type RegisterInput = z.infer<typeof registerSchema>["body"];
export type LoginInput = z.infer<typeof loginSchema>["body"];
export type AdminCreateUserInput = z.infer<typeof adminCreateUserSchema>["body"];
export type AdminUpdateUserInput = z.infer<typeof adminUpdateUserSchema>["body"];

