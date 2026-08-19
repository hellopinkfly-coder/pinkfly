import { z } from "zod";

export const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Please tell us your name."),
  email: z.string().email("Please enter a valid email address."),
  message: z.string().min(10, "A little more detail helps us help you."),
});

/** Where a founder is right now. Drives how the team follows up. */
export const JOIN_STAGES = [
  { value: "idea", label: "I have an idea" },
  { value: "building", label: "I'm building it" },
  { value: "revenue", label: "I have paying customers" },
  { value: "scaling", label: "I'm scaling a team" },
] as const;

export const joinSchema = z.object({
  name: z.string().min(2, "Please tell us your name."),
  email: z.string().email("Please enter a valid email address."),
  city: z.string().min(2, "Which city are you building from?"),
  stage: z.enum(
    JOIN_STAGES.map((s) => s.value) as unknown as [string, ...string[]],
    { message: "Pick the stage that fits best." }
  ),
  /** Optional — a sentence helps the team make the right introductions. */
  about: z.string().max(600, "Keep it under 600 characters.").optional(),
  /** Filled in by the client so leads can be routed regionally. */
  regionSlug: z.string().optional(),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type JoinInput = z.infer<typeof joinSchema>;
