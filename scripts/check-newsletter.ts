/**
 * Does subscribing actually work on a deployment?
 *
 * The form says "Something went wrong. Please try again." for every failure,
 * which tells a visitor what they need and a developer nothing. This asks the
 * endpoint what it is connected to, then posts one clearly-labelled address
 * through the real route and prints exactly what comes back.
 *
 * The address it uses is obviously fake. Delete it from the table, and from
 * the Studio's Subscribers list, when you are done.
 *
 *   npm run check:newsletter -- https://<deployment>
 */
const base = (process.argv.slice(2).find((a) => a.startsWith("http")) ?? "").replace(/\/+$/, "");
if (!base) {
  console.error("Pass the site to check, e.g. npm run check:newsletter -- https://example.com");
  process.exit(1);
}

type Status = {
  storing?: boolean;
  storeError?: string | null;
  table?: string;
  emailing?: boolean;
  resendKey?: string;
  from?: string;
  mirroringToSanity?: boolean;
};

async function main() {
  console.log(`Checking ${base}\n`);

  const status: Status = await (await fetch(`${base}/api/newsletter`)).json();
  console.log("Wiring");
  console.log(`  ${status.storing ? "✓" : "⚠"} Supabase table "${status.table}" ${status.storing ? "accepts queries" : "is NOT reachable"}`);
  if (status.storeError) console.log(`      ${status.storeError}`);
  console.log(`  ${status.emailing ? "✓" : "○"} welcome email ${status.emailing ? `sends from ${status.from}` : "not configured (RESEND_API_KEY missing)"}`);
  console.log(`  ${status.mirroringToSanity ? "✓" : "○"} Studio mirror ${status.mirroringToSanity ? "on" : "off (no SANITY_API_WRITE_TOKEN)"}`);

  const email = `check-${Date.now()}@pinkfly-test.invalid`;
  const response = await fetch(`${base}/api/newsletter`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, source: "form" }),
  });
  const body = await response.text();
  console.log(`\nPOST /api/newsletter  HTTP ${response.status}  ${body}`);

  if (response.ok) {
    console.log(
      `\n✓ Subscribing works. Remove ${email} from the table when you are done.`
    );
    return;
  }

  console.log("\n⚠ Subscribing is broken on this deployment.");
  if (status.storeError?.startsWith("42501")) {
    console.log(
      "    42501 is row-level security refusing the write. The table needs a\n" +
        "    policy allowing anonymous inserts."
    );
  } else if (status.storeError?.startsWith("42P01")) {
    console.log(`    42P01 means the table "${status.table}" does not exist.`);
  } else if (!status.storing) {
    console.log(
      "    Supabase is not reachable at all — usually a rotated or wrong\n" +
        "    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY / NEXT_PUBLIC_SUPABASE_URL."
    );
  }
  process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

export {};
