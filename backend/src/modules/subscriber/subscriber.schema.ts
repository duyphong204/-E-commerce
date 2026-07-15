import { z } from "zod";

export const createSubscriberSchema = z.object({
  body: z.object({
    email: z.string({ required_error: "Email is required" }).email("Invalid email format"),
  })
});

export type CreateSubscriberInput = z.infer<typeof createSubscriberSchema>["body"];
