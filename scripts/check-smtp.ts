/**
 * Does the mail account actually work?
 *
 * An email is the one part of this site that cannot be checked by loading a
 * page: it either reaches somebody or it does not, and the usual way to find
 * out is to discover a week later that nothing has arrived. This asks the
 * server directly.
 *
 *   npm run check:smtp                    → connects and logs in, sends nothing
 *   npm run check:smtp -- you@gmail.com   → also sends one real message there
 *
 * It reads the same environment the site does, so run it with the same
 * variables set (locally, an .env.local; on Vercel, `vercel env pull`).
 */
import { readFileSync } from "node:fs";

import { defaultFrom, sendEmail, transport, verifyTransport } from "../src/lib/email";
import { renderEmail, renderText } from "../src/lib/email-template";

/** The same .env.local reader the other scripts use; no dependency for it. */
function loadEnvLocal() {
  let file: string;
  try {
    file = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
  } catch {
    return;
  }
  for (const line of file.split("\n")) {
    const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)$/.exec(line);
    if (!match) continue;
    const [, key, raw] = match;
    if (process.env[key]) continue;
    process.env[key] = raw.trim().replace(/^["\']|["\']$/g, "");
  }
}
loadEnvLocal();

const to = process.argv[2];

async function main() {
  const how = transport();
  console.log(`Transport: ${how}`);
  if (how === "none") {
    console.log(
      "  ⚠ nothing is configured — set SMTP_USER and SMTP_PASSWORD (a Google\n" +
        "    app password, not the account password), or RESEND_API_KEY."
    );
    process.exit(1);
  }
  console.log(`From:      ${defaultFrom()}`);

  if (how === "smtp") {
    const host = process.env.SMTP_HOST || "smtp.gmail.com";
    const port = process.env.SMTP_PORT || "465";
    console.log(`Server:    ${host}:${port}`);
    const failure = await verifyTransport();
    if (failure) {
      console.log(`\n  ⚠ the server refused the login: ${failure}`);
      console.log(
        "\n  Gmail only accepts an app password, and only once two-step\n" +
          "  verification is on for the account. A password that works in the\n" +
          "  browser will be refused here."
      );
      process.exit(1);
    }
    console.log("  ✓ connected and signed in");
  }

  if (!to) {
    console.log("\nPass an address to send a real test message:");
    console.log("  npm run check:smtp -- you@example.com");
    return;
  }

  const content = {
    eyebrow: "Delivery check",
    headline: "This is the Pinkfly mailer.",
    paragraphs: [
      "If this is in your inbox, the site can send email: the account is signed in and the template renders.",
      `Sent ${new Date().toUTCString()} over ${how}.`,
    ],
    footnote: "You can delete this. Nobody else received it.",
  };

  const failure = await sendEmail({
    to,
    subject: "Pinkfly delivery check",
    text: renderText(content),
    html: renderEmail(content),
  });

  console.log(failure ? `\n  ⚠ not sent: ${failure}` : `\n  ✓ sent to ${to}`);
  if (failure) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
