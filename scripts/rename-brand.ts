/**
 * Rename the brand across the CMS: "Pink Fly" → "PinkFly".
 *
 * The site's copy lives in Sanity, so renaming the brand in code only changes
 * the seed and the outage fallback — the words a visitor reads come from the
 * documents. This rewrites them in place.
 *
 * It walks every published document and rewrites the string wherever it
 * appears in a text field, at any depth, leaving structure untouched. Keys
 * that are identifiers rather than copy — `_id`, `_type`, `_ref`, `_key`,
 * slugs and urls — are skipped, so nothing that a link or a reference depends
 * on can move. Documents whose id contains a dot are skipped too: they are
 * the private leftovers the site cannot read, and rewriting them would only
 * risk the copies that matter.
 *
 *   npm run rename:brand            # dry run, prints every change
 *   npm run rename:brand -- --apply # performs it
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
  console.error("Set SANITY_API_WRITE_TOKEN before running the rename.");
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

const FROM = /Pink\s+Fly/g;
const TO = "PinkFly";

/** Keys that carry an identifier or a link rather than copy. */
const SKIP = new Set(["_id", "_type", "_ref", "_key", "current", "url", "href", "slug"]);

type Doc = Record<string, unknown> & { _id: string; _type: string };
type Change = { path: string; before: string; after: string };

/** Rewrite copy in place, collecting what changed for the report. */
function rewrite<T>(value: T, path: string, changes: Change[]): T {
  if (typeof value === "string") {
    const after = value.replace(FROM, TO);
    if (after !== value) changes.push({ path, before: value, after });
    return after as unknown as T;
  }
  if (Array.isArray(value)) {
    return value.map((item, i) => rewrite(item, `${path}[${i}]`, changes)) as unknown as T;
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, inner] of Object.entries(value)) {
      out[key] = SKIP.has(key) ? inner : rewrite(inner, path ? `${path}.${key}` : key, changes);
    }
    return out as T;
  }
  return value;
}

async function main() {
  const docs = await client.fetch<Doc[]>(`*[!(_type match "system.*")]`);
  const visible = docs.filter((doc) => !doc._id.includes("."));
  console.log(
    `${docs.length} documents, ${visible.length} the site can read (dotted ids skipped)\n`
  );

  let touched = 0;
  const transaction = client.transaction();

  for (const doc of visible) {
    const changes: Change[] = [];
    const next = rewrite(doc, "", changes);
    if (changes.length === 0) continue;

    touched += 1;
    console.log(`${doc._id}  (${doc._type})`);
    for (const change of changes) {
      console.log(`    ${change.path}`);
      console.log(`      − ${change.before}`);
      console.log(`      + ${change.after}`);
    }
    transaction.createOrReplace(next as Doc);
  }

  if (touched === 0) {
    console.log("Nothing to rename — no document mentions the old spelling.");
    return;
  }

  if (!apply) {
    console.log(`\n${touched} document(s) would change. Re-run with --apply to perform it.`);
    return;
  }

  await transaction.commit();
  console.log(`\nRenamed the brand in ${touched} document(s).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
