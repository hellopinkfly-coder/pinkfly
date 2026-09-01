/**
 * Put Knowledge Base bodies back to plain paragraphs.
 *
 * An earlier attempt made each paragraph a `paragraph` object so that images
 * could sit beside them in one array. Sanity cannot mix plain text with
 * objects in an array, and the result was a body the Studio refused to render
 * at all: "Item of type paragraph not valid for this list".
 *
 * The article is now assembled from separate fields — paragraphs, then an
 * image, then more paragraphs — so `body` holds plain strings again. This
 * unwraps any paragraph object back to its text, carrying the copy across
 * unchanged and leaving strings alone, so it is safe to re-run.
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

async function main() {
  const entries = await client.fetch<Entry[]>(
    // Dot-free ids only — the dotted leftovers are private and the site never
    // reads them. `string::split` rather than `path()`: the path form matched
    // nothing here, which made an earlier run report "nothing to migrate" when
    // in fact it had looked at no documents at all.
    `*[_type == "kbEntry" && count(string::split(_id, ".")) == 1]{ _id, title, body }`
  );

  // What the bodies actually are, before deciding anything about them. A
  // migration that reports "nothing to do" is only reassuring if you can see
  // the shape it looked at.
  console.log(`${entries.length} entr(ies) the site can read\n`);
  for (const entry of entries.slice(0, 3)) {
    const body = entry.body ?? [];
    const shapes = body.map((block) =>
      typeof block === "string"
        ? "string"
        : `${(block as { _type?: string })?._type ?? "object without _type"}`
    );
    console.log(`${entry._id}`);
    console.log(`    ${body.length} block(s): ${JSON.stringify(shapes)}`);
    console.log(`    first block: ${JSON.stringify(body[0])?.slice(0, 220)}`);
  }
  console.log("");

  const transaction = client.transaction();
  let touched = 0;

  for (const entry of entries) {
    const body = entry.body ?? [];
    const objects = body.filter((block) => typeof block === "object" && block).length;
    if (objects === 0) continue;

    const next = body.map((block) =>
      typeof block === "string"
        ? block
        : ((block as { text?: string })?.text ?? "")
    );

    touched += 1;
    console.log(
      `${entry._id}  ${objects} object(s) → plain paragraphs  (${entry.title ?? "untitled"})`
    );
    transaction.patch(entry._id, { set: { body: next } });
  }

  if (touched === 0) {
    console.log("Every body is already plain paragraphs — nothing to migrate.");
    return;
  }

  if (!apply) {
    console.log(`\n${touched} entr(ies) would change. Re-run with --apply to perform it.`);
    return;
  }

  await transaction.commit();
  console.log(`\nUnwrapped the bodies of ${touched} entr(ies).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
