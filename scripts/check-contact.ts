/**
 * Does the contact form actually deliver?
 *
 * The form reported success long before it did anything with a message, so
 * "it says sent" proves nothing. This asks the endpoint what it is wired to,
 * then posts one clearly-labelled test message through the real route and
 * reports what comes back.
 *
 * The message is saved in the Studio under Messages → Needs a reply, and is
 * emailed on if Resend is configured. Delete it when you are done.
 *
 *   npm run check:contact -- https://<deployment>
 */
const base = (process.argv.slice(2).find((a) => a.startsWith("http")) ?? "").replace(/\/+$/, "");
if (!base) {
  console.error("Pass the site to check, e.g. npm run check:contact -- https://example.com");
  process.exit(1);
}

async function main() {
  const status = await fetch(`${base}/api/contact`);
  console.log("status  ", `HTTP ${status.status}`, await status.text());

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
      "\n  ✓ accepted — it is in the Studio under Messages → Needs a reply.\n" +
        "    The status line above says whether an email was sent as well:\n" +
        '    emailing:false means it was saved only.'
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
