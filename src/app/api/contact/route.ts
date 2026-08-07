import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations";

/**
 * Contact form stub.
 * Validates input and returns success — does NOT yet send email or persist.
 * Wire an email provider / inbox integration here before launch.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    // TODO: forward to inbox / CRM.
    console.log("[contact] new message from:", parsed.data.email);

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
