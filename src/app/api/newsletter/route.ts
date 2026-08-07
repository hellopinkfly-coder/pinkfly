import { NextResponse } from "next/server";
import { newsletterSchema } from "@/lib/validations";

/**
 * Newsletter subscription stub.
 * Validates input and returns success — does NOT yet persist or send email.
 * Wire an email provider (e.g. Resend, Mailchimp) here before launch.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = newsletterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    // TODO: persist subscriber / call email provider.
    console.log("[newsletter] new subscriber:", parsed.data.email);

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request." },
      { status: 400 }
    );
  }
}
