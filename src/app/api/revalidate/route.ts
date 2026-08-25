import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

/**
 * Sanity publish webhook → purge the CMS cache.
 *
 * Every Sanity query is cached by Next for 60 seconds and tagged `sanity`
 * (see `src/lib/cms/fetch.ts`). That window is the floor on how long a change
 * takes to appear, which is the wrong trade for a CMS: editors expect publish
 * and unpublish to be immediate, and 60s of staleness on every request is a
 * poor way to buy it.
 *
 * This route is the production answer. Sanity calls it on every document
 * change; it purges the tag, and the next request re-fetches. The 60-second
 * revalidate stays as the backstop for the case where the webhook never
 * arrives, so the site is never more than a minute stale even if this fails.
 *
 * Setting it up (Sanity → Manage → API → Webhooks → Create webhook):
 *   URL      https://<your-domain>/api/revalidate
 *   Dataset  production
 *   Trigger  Create, Update, Delete
 *   Filter   (leave empty — every document type feeds the site)
 *   HTTP     POST, Content-Type application/json
 *   Secret   the same value as the SANITY_REVALIDATE_SECRET env var
 *
 * The secret is required: without it this endpoint would let anyone force
 * cache purges. Requests that fail the signature check are rejected.
 */

/** Sanity signs the body as `t=<timestamp>,v1=<base64url hmac of "t.body">`. */
function verify(signature: string | null, body: string, secret: string): boolean {
  if (!signature) return false;

  const parts = Object.fromEntries(
    signature.split(",").map((part) => part.split("=", 2) as [string, string])
  );
  const timestamp = parts.t;
  const provided = parts.v1;
  if (!timestamp || !provided) return false;

  const expected = createHmac("sha256", secret)
    .update(`${timestamp}.${body}`)
    .digest("base64url");

  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    // Not configured is not an error the webhook should retry against — the
    // 60-second revalidate still keeps the site fresh on its own.
    return NextResponse.json(
      { revalidated: false, reason: "SANITY_REVALIDATE_SECRET is not set" },
      { status: 501 }
    );
  }

  const body = await request.text();
  if (!verify(request.headers.get("sanity-webhook-signature"), body, secret)) {
    return NextResponse.json(
      { revalidated: false, reason: "invalid signature" },
      { status: 401 }
    );
  }

  revalidateTag("sanity");

  // Echoed back so the delivery log in Sanity shows what was purged.
  let documentType: string | undefined;
  try {
    documentType = (JSON.parse(body) as { _type?: string })._type;
  } catch {
    // A body we cannot parse still purged the cache; the type is only a label.
  }

  return NextResponse.json({ revalidated: true, tag: "sanity", documentType });
}
