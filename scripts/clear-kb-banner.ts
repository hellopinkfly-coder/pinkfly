/**
 * Clear the Knowledge Base page banner.
 *
 * The banner image lives on the `knowledgeBasePage` document, so removing it
 * is a content change rather than a code one — the page already renders
 * without a banner when none is set. This unsets that one field and leaves
 * everything else on the document alone.
 *
 * The same thing can be done in the Studio in a few seconds: Pages →
 * Knowledge Base → clear the banner image → Publish. This exists for when
 * that is not to hand.
 *
 *   npm run clear:kb-banner            # dry run
 *   npm run clear:kb-banner -- --apply # performs it
 */
import { readFileSync } from "node:fs";

import { createClient } from "@sanity/client";

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
    process.env[key] = raw.trim().replace(/^["']|["']$/g, "");
  }
}
loadEnvLocal();

const token = process.env.SANITY_API_WRITE_TOKEN;
if (!token) {
  console.error("Set SANITY_API_WRITE_TOKEN before running this.");
  process.exit(1);
}

const apply = process.argv.includes("--apply");

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "5t0hmzzq",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-10-01",
  useCdn: false,
  perspective: "published",
  token,
});

async function main() {
  const docs = await client.fetch<{ _id: string; bannerImage?: unknown }[]>(
    `*[_type == "knowledgeBasePage"]{ _id, bannerImage }`
  );

  const withBanner = docs.filter((doc) => doc.bannerImage);
  if (withBanner.length === 0) {
    console.log("No Knowledge Base page has a banner set — nothing to clear.");
    return;
  }

  for (const doc of withBanner) {
    console.log(`${doc._id}: banner set`);
    console.log(`    ${JSON.stringify(doc.bannerImage)}`);
  }

  if (!apply) {
    console.log(`\n${withBanner.length} document(s) would have their banner cleared.`);
    console.log("Re-run with --apply to perform it.");
    return;
  }

  const transaction = client.transaction();
  for (const doc of withBanner) transaction.patch(doc._id, { unset: ["bannerImage"] });
  await transaction.commit();
  console.log(`\nCleared the banner on ${withBanner.length} document(s).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
