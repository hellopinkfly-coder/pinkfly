/**
 * One-time migration: give every document an id the site can actually read.
 *
 * Sanity reads a `.` in a document id as a path separator, and documents
 * inside a path are private — only a request carrying a token can see them.
 * The site reads anonymously, so documents seeded as `kbEntry.articles.slug`,
 * `event.slug`, `policyPage.slug`, `region.slug`, `initiative.slug`,
 * `teamMember.n` and `testimonial.n` were invisible to it: empty Knowledge
 * Base rails, no events, policy pages 404ing, and team references
 * dereferencing to null.
 *
 * This renames them to the same id with dashes, keeping the content as it
 * stands — including edits made in the Studio — rather than re-seeding over
 * it. References are repointed at the new ids before the old documents go, so
 * nothing is left dangling.
 *
 *   npm run migrate:ids            # dry run, prints the plan
 *   npm run migrate:ids -- --apply # performs it
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

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "5t0hmzzq",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-10-01",
  useCdn: false,
  perspective: "published",
  token,
});

type Doc = Record<string, unknown> & { _id: string; _type: string };

/** Rewrite every `_ref` that points at a renamed document. */
function repoint<T>(value: T, moved: Map<string, string>): T {
  if (Array.isArray(value)) {
    return value.map((item) => repoint(item, moved)) as unknown as T;
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, inner] of Object.entries(value)) {
      out[key] =
        key === "_ref" && typeof inner === "string" && moved.has(inner)
          ? moved.get(inner)
          : repoint(inner, moved);
    }
    return out as T;
  }
  return value;
}

async function main() {
  const apply = process.argv.includes("--apply");
  const docs = await client.fetch<Doc[]>(`*[!(_id in path("drafts.**"))]`);

  const moved = new Map<string, string>();
  for (const doc of docs) {
    if (doc._id.includes(".")) moved.set(doc._id, doc._id.replaceAll(".", "-"));
  }

  if (moved.size === 0) {
    console.log("Nothing to migrate: no document id contains a dot.");
    return;
  }

  console.log(`${moved.size} document(s) to rename:\n`);
  for (const [from, to] of moved) console.log(`    ${from}  →  ${to}`);

  if (!apply) {
    console.log("\nDry run. Re-run with --apply to perform it.");
    return;
  }

  // Create the renamed copies first, then repoint every referrer, and only
  // then delete the originals — Sanity refuses to delete a document that is
  // still referenced.
  let tx = client.transaction();
  for (const doc of docs) {
    const newId = moved.get(doc._id);
    if (!newId) continue;
    const { _id, _rev, _createdAt, _updatedAt, ...rest } = doc;
    void _id;
    void _rev;
    void _createdAt;
    void _updatedAt;
    tx = tx.createOrReplace({ _id: newId, ...repoint(rest, moved) } as never);
  }
  await tx.commit();
  console.log(`\nCreated ${moved.size} renamed document(s).`);

  let refTx = client.transaction();
  let referrers = 0;
  for (const doc of docs) {
    if (moved.has(doc._id)) continue;
    const rewritten = repoint(doc, moved);
    if (JSON.stringify(rewritten) === JSON.stringify(doc)) continue;
    const { _rev, _createdAt, _updatedAt, ...rest } = rewritten as Doc;
    void _rev;
    void _createdAt;
    void _updatedAt;
    refTx = refTx.createOrReplace(rest as never);
    referrers += 1;
  }
  if (referrers > 0) {
    await refTx.commit();
    console.log(`Repointed references in ${referrers} document(s).`);
  }

  let deleteTx = client.transaction();
  for (const oldId of moved.keys()) deleteTx = deleteTx.delete(oldId);
  await deleteTx.commit();
  console.log(`Deleted ${moved.size} original document(s).\n`);
  console.log("Done. The site reads these anonymously now.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
