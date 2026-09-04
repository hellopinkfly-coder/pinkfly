/**
 * Where is the image, and which document is the site reading?
 *
 * When the Studio shows an image the website does not, the two are looking at
 * different documents. This prints every document that mentions a title,
 * across drafts and published and including the private dotted ids the site
 * cannot read, with the image each one holds — so the document carrying the
 * upload can be named rather than guessed at.
 *
 *   npm run find:image -- "Bootstrapper"
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

const term = process.argv.slice(2).find((arg) => !arg.startsWith("-")) ?? "Bootstrapper";

const base = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "5t0hmzzq",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-10-01",
  useCdn: false,
};

const withToken = createClient({
  ...base,
  perspective: "raw",
  ...(process.env.SANITY_API_WRITE_TOKEN
    ? { token: process.env.SANITY_API_WRITE_TOKEN }
    : {}),
});

const anon = createClient({ ...base, perspective: "published" });

type Doc = {
  _id: string;
  _type: string;
  _updatedAt: string;
  title?: string;
  imageRef?: string;
  imageUrl?: string;
  inlineRef?: string;
};

const PROJECTION = `{
  _id, _type, _updatedAt, title,
  "imageRef": image.asset._ref,
  "imageUrl": image.url,
  "inlineRef": inlineImage.asset._ref
}`;

function describe(doc: Doc) {
  const draft = doc._id.startsWith("drafts.");
  const dotted = doc._id.replace(/^drafts\./, "").includes(".");
  console.log(`  ${doc._id}`);
  console.log(`      updated ${doc._updatedAt}`);
  console.log(`      image.asset    ${doc.imageRef ?? "—"}`);
  console.log(`      image.url      ${doc.imageUrl ? doc.imageUrl.slice(0, 60) : "—"}`);
  console.log(`      inlineImage    ${doc.inlineRef ?? "—"}`);
  if (draft) console.log("      ⚠ a draft — the site never reads drafts");
  if (dotted) console.log("      ⚠ dotted id — private, the site cannot read it");
}

async function main() {
  console.log(`Searching for documents whose title contains "${term}"\n`);

  const all = await withToken.fetch<Doc[]>(
    `*[defined(title) && title match $term] | order(_updatedAt desc) ${PROJECTION}`,
    { term: `*${term}*` }
  );

  console.log("=== every matching document, drafts and private ids included ===");
  if (all.length === 0) console.log("  none");
  all.forEach(describe);

  const visible = await anon.fetch<Doc[]>(
    `*[defined(title) && title match $term] ${PROJECTION}`,
    { term: `*${term}*` }
  );

  console.log("\n=== what the website can actually see ===");
  if (visible.length === 0) {
    console.log("  none — the site cannot read any document with this title");
  }
  visible.forEach(describe);

  // Recently uploaded assets: proves whether the file reached Sanity at all,
  // which is the question a size or upload failure would answer.
  const assets = await withToken.fetch<
    { _id: string; originalFilename?: string; size?: number; _createdAt: string }[]
  >(`*[_type == "sanity.imageAsset"] | order(_createdAt desc)[0...5]{
       _id, originalFilename, size, _createdAt
     }`);

  console.log("\n=== the five most recently uploaded images ===");
  for (const asset of assets) {
    const mb = asset.size ? (asset.size / 1_000_000).toFixed(2) : "?";
    console.log(`  ${asset._createdAt}  ${mb} MB  ${asset.originalFilename ?? asset._id}`);
    console.log(`      ${asset._id}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
