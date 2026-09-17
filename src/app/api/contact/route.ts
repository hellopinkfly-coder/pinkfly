import { NextResponse } from "next/server";
import { createClient } from "next-sanity";
import { contactSchema } from "@/lib/validations";
import { projectId, dataset, apiVersion, cmsEnabled } from "../../../../sanity/env";

/**
 * The contact form.
 *
 * It used to validate a message, log the sender's address and return success
 * — the visitor was told it had been sent and nobody received anything. A
 * message now goes to two places:
 *
 *  1. **Sanity**, as a `contactMessage` document. This is the record: it
 *     survives a bounced email, a full inbox and a spam folder, and the
 *     Studio lists what still needs a reply.
 *  2. **An inbox**, through Resend, so nobody has to remember to check the
 *     Studio.
 *
 * Sanity is the one that must succeed. If the email fails the message is
 * still saved and the visitor is still thanked — telling them to try again
 * would only produce a second copy of a message that did arrive. The failure
 * is logged and the document records that no email went out.
 *
 * Environment:
 *   SANITY_API_WRITE_TOKEN  required, the same token the comments use
 *   RESEND_API_KEY          optional; without it nothing is emailed
 *   CONTACT_FROM_EMAIL      the From address, on a domain verified in Resend
 *   CONTACT_TO_EMAIL        where messages are sent
 */

/** What the form and a status check can ask about this route. */
export async function GET() {
  const hasToken = Boolean(process.env.SANITY_API_WRITE_TOKEN);
  return NextResponse.json({
    saving: hasToken && cmsEnabled,
    emailing: Boolean(process.env.RESEND_API_KEY && resendTo()),
    writeToken: hasToken ? "present" : "missing",
    resendKey: process.env.RESEND_API_KEY ? "present" : "missing",
  });
}

/** Where messages are emailed. */
function resendTo(): string | undefined {
  return process.env.CONTACT_TO_EMAIL || undefined;
}

/**
 * The From address.
 *
 * Resend will only send from a domain verified in the Resend account, so this
 * cannot be the visitor's own address; their address goes in Reply-To, which
 * makes replying from the inbox work as expected.
 */
function resendFrom(): string {
  return process.env.CONTACT_FROM_EMAIL || "Pinkfly <onboarding@resend.dev>";
}

type Message = { name: string; email: string; message: string };

/** Hands the message to Resend. Returns the failure rather than throwing. */
async function sendEmail(data: Message): Promise<string | null> {
  const key = process.env.RESEND_API_KEY;
  const to = resendTo();
  if (!key || !to) return "not configured";

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: resendFrom(),
        to: [to],
        reply_to: data.email,
        subject: `Pinkfly contact form — ${data.name}`,
        text: [
          `From: ${data.name} <${data.email}>`,
          "",
          data.message,
          "",
          "— Sent from the contact form on pinkfly.vercel.app/about",
        ].join("\n"),
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

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const token = process.env.SANITY_API_WRITE_TOKEN;

  // Email first, so the document can record whether it went out. Nothing is
  // returned to the visitor on a failure here — see the note above.
  const emailError = await sendEmail(data);
  if (emailError) console.error("[contact] email not sent:", emailError);

  if (!token || !cmsEnabled) {
    // No store to write to. An email that went out still counts as delivered;
    // otherwise the message is gone, and saying so beats a false success.
    if (!emailError) return NextResponse.json({ ok: true }, { status: 200 });
    console.error("[contact] message dropped — no write token and no email");
    return NextResponse.json(
      { error: "We could not send that. Please email us directly." },
      { status: 503 }
    );
  }

  try {
    const client = createClient({
      projectId,
      dataset,
      apiVersion,
      token,
      useCdn: false,
    });

    await client.create({
      _type: "contactMessage",
      handled: false,
      name: data.name,
      email: data.email,
      message: data.message,
      emailed: !emailError,
      receivedAt: new Date().toISOString(),
    });
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    console.error("[contact] could not save message:", reason);
    // Saved nowhere and emailed nowhere is a real failure. Emailed but not
    // saved is not: the message reached a person.
    if (emailError) {
      return NextResponse.json(
        { error: "Something went wrong. Please try again.", reason },
        { status: 502 }
      );
    }
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
