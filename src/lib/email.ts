import nodemailer, { type Transporter } from "nodemailer";

/**
 * Sending email.
 *
 * One place, because three messages go out — the contact note, the receipt
 * that answers whoever wrote it, and the newsletter welcome — and they had
 * drifted into two copies of the same fetch with two different ideas of what
 * a failure meant.
 *
 * Two ways out, and SMTP is the one Pinkfly uses: a Gmail account with an app
 * password, which needs no domain verification and sends as an address people
 * already recognise. Resend stays as the alternative, because it was here
 * first and because a key is the easier thing to hold on a host that cannot
 * open an outbound SMTP port. Whichever is configured is the one used; where
 * both are, SMTP wins, since that is the deliberate choice.
 *
 * Environment — SMTP (Gmail):
 *   SMTP_USER             the full Gmail address mail is sent from
 *   SMTP_PASSWORD         a Google **app password**, not the account password
 *   SMTP_HOST             optional; smtp.gmail.com
 *   SMTP_PORT             optional; 465 (implicit TLS), or 587 for STARTTLS
 *
 * Environment — Resend:
 *   RESEND_API_KEY        the key; the From domain must be verified there
 *
 * Environment — addresses, either way:
 *   CONTACT_FROM_EMAIL    the From address; defaults to SMTP_USER
 *   NEWSLETTER_FROM_EMAIL optional; the newsletter's own From
 *   CONTACT_TO_EMAIL      where contact-form messages are sent
 *
 * Gmail will only send as the signed-in account or one of its verified
 * aliases, and Resend only from a domain verified in the account, so either
 * way the From address can never be the visitor's own. Theirs goes in
 * Reply-To, which is what makes replying from the inbox work.
 */

export type EmailMessage = {
  to: string;
  subject: string;
  /** Always sent: what a text client, a filter and a reader in text mode get. */
  text: string;
  /** The designed version, where the client will render it. */
  html?: string;
  /** The address a reply should go to, when it is not the From address. */
  replyTo?: string;
  /** Overrides the default From — used by the newsletter. */
  from?: string;
};

/** True when an SMTP account is configured. */
export function smtpConfigured(): boolean {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASSWORD);
}

/** Which way mail goes out, or none. Reported by the status endpoints. */
export function transport(): "smtp" | "resend" | "none" {
  if (smtpConfigured()) return "smtp";
  if (process.env.RESEND_API_KEY) return "resend";
  return "none";
}

/**
 * The default From address.
 *
 * The SMTP account's own address is the right default under Gmail: it is the
 * only one Gmail will send as without an alias being verified first, so a
 * mismatched CONTACT_FROM_EMAIL is the quietest way to have every message
 * rejected.
 */
export function defaultFrom(): string {
  return (
    process.env.CONTACT_FROM_EMAIL ||
    process.env.SMTP_USER ||
    "Pinkfly <onboarding@resend.dev>"
  );
}

/** The newsletter's From address, which may differ from the contact one. */
export function newsletterFrom(): string {
  return process.env.NEWSLETTER_FROM_EMAIL || defaultFrom();
}

/** True when mail can actually go out, either way. */
export function emailConfigured(): boolean {
  return transport() !== "none";
}

/**
 * The SMTP connection, made once.
 *
 * A route handler can run many times in one warm instance, and a fresh
 * connection per message is a TLS handshake and a login per message. The
 * pooled transporter keeps the connection open between them, which is also
 * what keeps Gmail from treating a burst as a sign-in attempt per message.
 */
let cached: Transporter | null = null;

function transporter(): Transporter {
  if (cached) return cached;

  const port = Number(process.env.SMTP_PORT || 465);
  cached = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port,
    // 465 is TLS from the first byte; 587 opens in the clear and upgrades.
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    pool: true,
    maxConnections: 2,
  });
  return cached;
}

/** Proves the credentials work, without sending anything. Used by the checks. */
export async function verifyTransport(): Promise<string | null> {
  if (!smtpConfigured()) return "SMTP is not configured";
  try {
    await transporter().verify();
    return null;
  } catch (error) {
    return error instanceof Error ? error.message : String(error);
  }
}

async function viaSmtp(message: EmailMessage): Promise<string | null> {
  try {
    await transporter().sendMail({
      from: message.from ?? defaultFrom(),
      to: message.to,
      subject: message.subject,
      text: message.text,
      ...(message.html ? { html: message.html } : null),
      ...(message.replyTo ? { replyTo: message.replyTo } : null),
    });
    return null;
  } catch (error) {
    // Gmail's own words are the useful part: "Username and Password not
    // accepted" means an app password was not used, and "Invalid login"
    // usually means two-step verification is off.
    return (error instanceof Error ? error.message : String(error)).slice(0, 500);
  }
}

async function viaResend(message: EmailMessage): Promise<string | null> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return "not configured";

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
        ...(message.html ? { html: message.html } : null),
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

/**
 * Hands one message to whichever way out is configured.
 *
 * Returns the failure as a string rather than throwing: every caller here
 * treats email as the second of two deliveries, and a send that fails must
 * not lose the first one.
 */
export async function sendEmail(message: EmailMessage): Promise<string | null> {
  if (!message.to) return "no recipient";

  switch (transport()) {
    case "smtp":
      return viaSmtp(message);
    case "resend":
      return viaResend(message);
    default:
      return "not configured";
  }
}
