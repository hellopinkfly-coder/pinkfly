import { NextResponse } from "next/server";
import { newsletterSchema } from "@/lib/validations";
import { NEWSLETTER_TABLE, supabase } from "@/lib/supabase";

/**
 * Newsletter subscription.
 *
 * The email is validated here and written to Supabase. The write runs on the
 * server so the browser never talks to the database directly and the form
 * keeps its own success and error states — the page is unchanged.
 *
 * An address that is already subscribed is a success, not an error: the
 * visitor asked to be on the list and they are on it. Saying otherwise would
 * only tell a stranger who has already signed up.
 */
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
  if (error && error.code !== "23505") {
    console.error("[newsletter] could not save subscriber:", error.message);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
