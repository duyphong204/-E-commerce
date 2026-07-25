import { z } from 'zod';

export const UserRoleSchema = z.enum(['customer', 'admin']);

export const AccountSchema = z.object({
  _id: z.string(),
  name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  role: UserRoleSchema,
  createdAt: z.string().optional(),
});

export const CreateAccountSchema = z.object({
  name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  role: UserRoleSchema,
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự').optional(),
});

export const UpdateAccountSchema = z.object({
  id: z.string(),
  name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  role: UserRoleSchema,
});

export type Account = z.infer<typeof AccountSchema>;
export type CreateAccountInput = z.infer<typeof CreateAccountSchema>;
export type UpdateAccountInput = z.infer<typeof UpdateAccountSchema>;
