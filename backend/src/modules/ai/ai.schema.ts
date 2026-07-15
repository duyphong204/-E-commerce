import { z } from "zod";

export const askAiSchema = z.object({
  body: z.object({
    message: z.string({ required_error: "Message is required" }).min(1, "Message cannot be empty"),
  })
});

export type AskAiInput = z.infer<typeof askAiSchema>["body"];
