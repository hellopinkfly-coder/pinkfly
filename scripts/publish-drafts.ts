/**
 * Publish drafts from the server, when the Studio will not.
 *
 * Publishing in Sanity is not a flag — it copies the draft document over the
 * published one and deletes the draft. The Studio does that from the browser,
 * and when the browser cannot hold a connection to the API the click appears
 * to succeed while the copy never happens: the draft keeps the edit, the
 * published document keeps the old content, and the website — which reads
 * published documents only — shows the old content.
 *
 * This performs the same operation with a server-side token, so it does not
 * depend on the browser at all.
 *
 *   npm run publish:drafts            # dry run, lists what would be published
 *   npm run publish:drafts -- --apply # performs it
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
  perspective: "raw",
  token,
});

type Draft = Record<string, unknown> & {
  _id: string;
  _type: string;
  title?: string;
};

async function main() {
  const drafts = await client.fetch<Draft[]>(
    `*[_id in path("drafts.**")] | order(_updatedAt desc)`
  );

  if (drafts.length === 0) {
    console.log("No drafts — everything is already published.");
    return;
  }

  console.log(`${drafts.length} draft(s) waiting to be published\n`);

  const transaction = client.transaction();

  for (const draft of drafts) {
    const publishedId = draft._id.replace(/^drafts\./, "");

    // What the draft changes, in the terms that matter here: the image.
    const published = await client.fetch<{ imageRef?: string } | null>(
      `*[_id == $id][0]{ "imageRef": image.asset._ref }`,
      { id: publishedId }
    );
    const draftImage = (draft as { image?: { asset?: { _ref?: string } } }).image
      ?.asset?._ref;

    console.log(`${draft._type}  ${draft.title ?? publishedId}`);
    console.log(`    ${draft._id}`);
    console.log(`    → ${publishedId}`);
    if (draftImage || published?.imageRef) {
      console.log(`    image published  ${published?.imageRef ?? "none"}`);
      console.log(`    image in draft   ${draftImage ?? "none"}`);
    }

    // Exactly what publishing does: the draft becomes the published document,
    // keeping its id without the prefix, and the draft is removed.
    const { _id, ...content } = draft;
    void _id;
    transaction.createOrReplace({ ...content, _id: publishedId } as Draft);
    transaction.delete(draft._id);
  }

  if (!apply) {
    console.log(`\n${drafts.length} draft(s) would be published.`);
    console.log("Re-run with --apply to perform it.");
    return;
  }

  await transaction.commit();
  console.log(`\nPublished ${drafts.length} draft(s).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
