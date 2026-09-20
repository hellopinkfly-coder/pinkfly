import { NextResponse } from "next/server";
import { newsletterSchema } from "@/lib/validations";
import { NEWSLETTER_TABLE, supabase } from "@/lib/supabase";
import { emailConfigured, newsletterFrom, sendEmail } from "@/lib/email";
import { siteConfig } from "@/config/site";

/**
 * Newsletter subscription.
 *
 * Two things happen, in this order:
 *
 *  1. **Supabase** stores the address. This is the list — it is what a
 *     newsletter is eventually sent to, and it must succeed.
 *  2. **Resend** sends one welcome email, so subscribing visibly does
 *     something. Without it a visitor typed their address, saw a tick, and
 *     heard nothing ever again.
 *
 * The welcome email is not the newsletter itself. Sending an actual issue to
 * everyone on the list is a separate job and belongs in Resend Broadcasts or
 * an equivalent, reading the same table — not in a request handler that has
 * one visitor waiting on it.
 *
 * An address that is already subscribed is a success, and gets no second
 * welcome: the visitor asked to be on the list and they are on it. Saying
 * otherwise would tell a stranger who has already signed up.
 *
 * A failed email is logged and swallowed. The address is on the list, which
 * is the part that cannot be repeated — telling the visitor to try again
 * would only produce a duplicate.
 */

/** What a status check can ask about this route. */
export async function GET() {
  return NextResponse.json({
    storing: true,
    emailing: emailConfigured(),
    resendKey: process.env.RESEND_API_KEY ? "present" : "missing",
    from: newsletterFrom(),
  });
}

/** The welcome email. Plain text: it is three lines and two links. */
function welcome(email: string) {
  return {
    to: email,
    from: newsletterFrom(),
    subject: `Welcome to the ${siteConfig.name} newsletter`,
    text: [
      "You're on the list.",
      "",
      "Every issue carries the new playbooks, the policy changes worth knowing, and the events near you. Nothing else.",
      "",
      `If you have not joined the community itself yet, that is the bigger door: ${siteConfig.url}/join`,
      "",
      `— The ${siteConfig.name} team`,
      "",
      "You received this because you subscribed at " + siteConfig.url + ".",
      `To stop receiving it, reply to this email and we will take you off the list.`,
    ].join("\n"),
  };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const email = parsed.data.email.trim().toLowerCase();

  const { error } = await supabase()
    .from(NEWSLETTER_TABLE)
    .insert({ email });

  // 23505 is Postgres' unique violation — the address is already on the list.
  const alreadySubscribed = error?.code === "23505";

  if (error && !alreadySubscribed) {
    console.error("[newsletter] could not save subscriber:", error.message);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 502 }
    );
  }

  if (!alreadySubscribed) {
    const failure = await sendEmail(welcome(email));
    if (failure && failure !== "not configured") {
      console.error("[newsletter] welcome email not sent:", failure);
    }
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
