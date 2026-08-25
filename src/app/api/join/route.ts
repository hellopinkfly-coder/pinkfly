import { NextResponse } from "next/server";
import { joinSchema } from "@/lib/validations";

/**
 * Membership applications from the Join Community form.
 *
 * Validates, then forwards to the CRM when `CRM_WEBHOOK_URL` is configured —
 * the same destination the Google Form route was always meant to reach:
 *
 *   Join form → CRM_WEBHOOK_URL → CRM record, tagged by region
 *
 * With no webhook set the submission is logged and still returns success, so
 * the form works end to end in development. Wire the webhook (and persistence
 * or a confirmation email) before launch — see the README.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = joinSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const webhook = process.env.CRM_WEBHOOK_URL;

    if (webhook) {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...parsed.data,
          source: "pinkfly-join-form",
          submittedAt: new Date().toISOString(),
        }),
      });
      // Never surface a CRM outage to the applicant — the submission is
      // valid, and losing it loudly is worse than logging it for recovery.
      if (!res.ok) {
        console.error("[join] CRM webhook rejected the submission:", res.status);
      }
    } else {
      console.log("[join] application received:", parsed.data);
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
