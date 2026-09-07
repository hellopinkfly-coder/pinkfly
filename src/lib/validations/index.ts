import { z } from "zod";

export const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Please tell us your name."),
  email: z.string().email("Please enter a valid email address."),
  message: z.string().min(10, "A little more detail helps us help you."),
});

export const commentSchema = z.object({
  entryId: z.string().min(1),
  name: z.string().trim().min(2, "Please tell us your name.").max(80),
  body: z
    .string()
    .trim()
    .min(4, "Please write a little more.")
    .max(2000, "Please keep it under 2000 characters."),
});

export type CommentInput = z.infer<typeof commentSchema>;

export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
