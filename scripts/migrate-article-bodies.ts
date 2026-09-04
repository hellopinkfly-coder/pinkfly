/**
 * Convert body copy from plain strings to Portable Text.
 *
 * A link is an annotation on a span of text, so body copy has to be Portable
 * Text for an editor to add one. Sanity cannot hold plain strings in a block
 * array — it renders them as "not valid for this list" — so the existing copy
 * has to be converted rather than left beside the new shape.
 *
 * Each string becomes one paragraph block carrying that text and nothing else,
 * so the copy is identical and only its container changes. Blocks that are
 * already Portable Text are left alone, which makes a second run a no-op.
 *
 * Covers both Knowledge Base bodies and event descriptions.
 *
 *   npm run migrate:bodies            # dry run
 *   npm run migrate:bodies -- --apply # performs it
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
  console.error("Set SANITY_API_WRITE_TOKEN before running the migration.");
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

type Entry = { _id: string; title?: string; body?: unknown[] };

type Doc = { _id: string; _type: string; title?: string } & Record<string, unknown>;

/** One paragraph of Portable Text carrying exactly this text. */
function block(text: string, i: number) {
  return {
    _key: `b${i}`,
    _type: "block",
    style: "normal",
    markDefs: [],
    children: [{ _key: `s${i}`, _type: "span", text, marks: [] }],
  };
}

/** The fields holding body copy, by document type. */
const FIELDS: Record<string, string[]> = {
  kbEntry: ["body", "bodyAfterImage"],
  event: ["description"],
};

async function main() {
  const docs = await client.fetch<Doc[]>(
    // Dot-free ids only — the dotted leftovers are private and the site never
    // reads them.
    `*[_type in ["kbEntry", "event"] && count(string::split(_id, ".")) == 1]`
  );

  const transaction = client.transaction();
  let touched = 0;

  for (const doc of docs) {
    const set: Record<string, unknown> = {};

    for (const field of FIELDS[doc._type] ?? []) {
      const value = doc[field];
      if (!Array.isArray(value)) continue;
      const strings = value.filter((item) => typeof item === "string");
      if (strings.length === 0) continue;

      set[field] = value.map((item, i) =>
        typeof item === "string" ? block(item, i) : item
      );
      console.log(
        `${doc._id}  ${field}: ${strings.length} string(s) → Portable Text  (${doc.title ?? "untitled"})`
      );
    }

    if (Object.keys(set).length === 0) continue;
    touched += 1;
    transaction.patch(doc._id, { set });
  }

  if (touched === 0) {
    console.log("Every body is already Portable Text — nothing to migrate.");
    return;
  }

  if (!apply) {
    console.log(`\n${touched} document(s) would change. Re-run with --apply to perform it.`);
    return;
  }

  await transaction.commit();
  console.log(`\nConverted ${touched} document(s).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
