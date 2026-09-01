/**
 * Convert Knowledge Base bodies from plain strings to paragraph objects.
 *
 * Sanity cannot mix primitive and object members in one array. While a body
 * held plain strings, the Studio could not offer Image, Video or File beside
 * them — the whole point of the richer body. Converting each string to a
 * `paragraph` object makes every member an object, and the "Add item" menu
 * then offers all four.
 *
 * The copy is carried across unchanged; only its container changes. Blocks
 * that are already objects are left exactly as they are, so this is safe to
 * re-run and does nothing on a second pass.
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
    `*[_type == "kbEntry" && !(_id in path("*.*"))]{ _id, title, body }`
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
    const strings = body.filter((block) => typeof block === "string").length;
    if (strings === 0) continue;

    const next = body.map((block, i) =>
      typeof block === "string"
        ? { _key: `body-${i}`, _type: "paragraph", text: block }
        : block
    );

    touched += 1;
    console.log(
      `${entry._id}  ${strings} paragraph(s) → objects  (${entry.title ?? "untitled"})`
    );
    transaction.patch(entry._id, { set: { body: next } });
  }

  if (touched === 0) {
    console.log("Every body is already made of objects — nothing to migrate.");
    return;
  }

  if (!apply) {
    console.log(`\n${touched} entr(ies) would change. Re-run with --apply to perform it.`);
    return;
  }

  await transaction.commit();
  console.log(`\nConverted the bodies of ${touched} entr(ies).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
