/**
 * Does the contact form actually deliver?
 *
 * The form reported success long before it did anything with a message, so
 * "it says sent" proves nothing. This asks the endpoint what it is wired to,
 * then posts one clearly-labelled test message through the real route and
 * reports what comes back.
 *
 * The message is saved in the Studio under Messages → Needs a reply, copied
 * into the Supabase contact_messages table, and emailed on if Resend is
 * configured. Delete it from both when you are done.
 *
 *   npm run check:contact -- https://<deployment>
 */
const base = (process.argv.slice(2).find((a) => a.startsWith("http")) ?? "").replace(/\/+$/, "");
if (!base) {
  console.error("Pass the site to check, e.g. npm run check:contact -- https://example.com");
  process.exit(1);
}

type Status = {
  saving?: boolean;
  emailing?: boolean;
  mirroring?: boolean;
  mirrorError?: string | null;
  table?: string;
};

async function main() {
  const status = await fetch(`${base}/api/contact`);
  const raw = await status.text();
  console.log("status  ", `HTTP ${status.status}`, raw);

  // Read it rather than printing it and leaving the reader to parse JSON.
  let wiring: Status = {};
  try {
    wiring = JSON.parse(raw) as Status;
  } catch {
    /* Not JSON — the raw line above is all there is to say. */
  }

  console.log("\nWiring");
  console.log(`  ${wiring.saving ? "✓" : "⚠"} Sanity ${wiring.saving ? "accepts messages" : "is NOT wired (no write token)"}`);
  console.log(
    `  ${wiring.mirroring ? "✓" : "⚠"} Supabase table "${wiring.table ?? "contact_messages"}" ` +
      (wiring.mirroring ? "accepts queries" : `is NOT reachable — ${wiring.mirrorError ?? "unknown"}`)
  );
  console.log(`  ${wiring.emailing ? "✓" : "○"} email ${wiring.emailing ? "configured" : "not configured"}`);

  const stamp = new Date().toISOString();
  const response = await fetch(`${base}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Delivery check",
      email: "check@example.com",
      message:
        `Automated delivery check sent at ${stamp}. ` +
        "Nobody wrote this — delete it from Messages in the Studio.",
    }),
  });

  const body = await response.text();
  console.log(`\nPOST /api/contact  HTTP ${response.status}  ${body}`);

  if (response.ok) {
    console.log(
      "\n  ✓ accepted — it is in the Studio under Messages → Needs a reply,\n" +
        "    and in the Supabase contact_messages table. Delete it from both\n" +
        "    when you are done. The wiring above says which destinations were live."
    );
  } else {
    console.log("\n  ⚠ The message was not accepted. The response above says why.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

export {};
