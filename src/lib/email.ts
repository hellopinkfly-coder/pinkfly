/**
 * Sending email, through Resend.
 *
 * One place, because two routes send mail — the contact form and the
 * newsletter — and they had drifted into two copies of the same fetch with
 * two different ideas of what a failure meant.
 *
 * Environment:
 *   RESEND_API_KEY        required; without it nothing is sent
 *   CONTACT_FROM_EMAIL    the From address, on a domain verified in Resend
 *   NEWSLETTER_FROM_EMAIL optional; the From address for newsletter mail,
 *                         falling back to CONTACT_FROM_EMAIL
 *   CONTACT_TO_EMAIL      where contact-form messages are sent
 *
 * Resend will only send from a domain verified in the Resend account, so the
 * From address can never be the visitor's own; theirs goes in Reply-To, which
 * is what makes replying from the inbox work.
 */

export type EmailMessage = {
  to: string;
  subject: string;
  text: string;
  /** The address a reply should go to, when it is not the From address. */
  replyTo?: string;
  /** Overrides the default From — used by the newsletter. */
  from?: string;
};

/** The default From address, or Resend's shared sandbox sender. */
export function defaultFrom(): string {
  return process.env.CONTACT_FROM_EMAIL || "Pinkfly <onboarding@resend.dev>";
}

/** The newsletter's From address, which may differ from the contact one. */
export function newsletterFrom(): string {
  return process.env.NEWSLETTER_FROM_EMAIL || defaultFrom();
}

/** True when a key is configured and mail can actually go out. */
export function emailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

/**
 * Hands one message to Resend.
 *
 * Returns the failure as a string rather than throwing: every caller here
 * treats email as the second of two deliveries, and a send that fails must
 * not lose the first one.
 */
export async function sendEmail(message: EmailMessage): Promise<string | null> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return "not configured";
  if (!message.to) return "no recipient";

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: message.from ?? defaultFrom(),
        to: [message.to],
        ...(message.replyTo ? { reply_to: message.replyTo } : null),
        subject: message.subject,
        text: message.text,
      }),
    });

    if (!response.ok) {
      // Resend says why in the body: an unverified domain and a bad key are
      // the two usual answers, and they read nothing alike.
      return `${response.status} ${await response.text()}`.slice(0, 500);
    }
    return null;
  } catch (error) {
    return error instanceof Error ? error.message : String(error);
  }
}
