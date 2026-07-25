import { z } from "zod";

export const checkoutItemSchema = z.object({
  productId: z.string().length(24, "Mã sản phẩm không hợp lệ"),
  name: z.string().min(1, "Tên sản phẩm không được trống"),
  image: z.string().min(1, "Ảnh sản phẩm không được trống"),
  price: z.number().positive("Giá sản phẩm phải lớn hơn 0"),
  quantity: z.number().int().positive("Số lượng phải lớn hơn 0"),
  size: z.string().optional(),
  color: z.string().optional(),
});

export const shippingAddressSchema = z.object({
  address: z.string().min(1, "Địa chỉ là bắt buộc"),
  city: z.string().min(1, "Thành phố là bắt buộc"),
  postalCode: z.string().trim().regex(/^\d{5,6}$/, "Mã bưu chính phải gồm 5 hoặc 6 chữ số."),
  country: z.string().min(1, "Quốc gia là bắt buộc"),
  phone: z.string().trim().regex(/^(?:\+?84|0)\d{9,10}$/, "Số điện thoại không hợp lệ"),
});

export const createCheckoutSchema = z.object({
  body: z.object({
    checkoutItems: z.array(checkoutItemSchema).min(1, "Không có sản phẩm để thanh toán"),
    shippingAddress: shippingAddressSchema,
    paymentMethod: z.string().min(1, "Phương thức thanh toán là bắt buộc"),
    totalPrice: z.number().positive("Tổng giá trị đơn hàng không hợp lệ."),
    couponCode: z.string().optional(),
    couponId: z.string().optional(),
  })
});

export const markAsPaidSchema = z.object({
  params: z.object({
    id: z.string().length(24, "ID đơn thanh toán không hợp lệ"),
  }),
  body: z.object({
    paymentStatus: z.enum(["Paid"], { required_error: "paymentStatus must be 'Paid'" }),
    paymentDetails: z.any().optional(),
  })
});

export const finalizeCheckoutSchema = z.object({
  params: z.object({
    id: z.string().length(24, "ID đơn thanh toán không hợp lệ"),
  })
});

export type CreateCheckoutInput = z.infer<typeof createCheckoutSchema>["body"];
export type MarkAsPaidInput = z.infer<typeof markAsPaidSchema>["body"];
export type FinalizeCheckoutInput = z.infer<typeof finalizeCheckoutSchema>["params"];
