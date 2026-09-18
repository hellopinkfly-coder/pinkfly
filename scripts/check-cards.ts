/**
 * Is the Knowledge Base grid serving the image that is in Sanity?
 *
 * A card showing an older picture has two possible causes that look
 * identical from a phone: the page being served is stale, or the browser is
 * holding an old copy. This tells them apart by asking Sanity what the card
 * image is now, then reading what the live grid actually references, and
 * printing the caching headers the deployment returns.
 *
 *   npm run check:cards -- https://<deployment>
 */
import { createClient } from "@sanity/client";

const base = (process.argv.slice(2).find((a) => a.startsWith("http")) ?? "").replace(/\/+$/, "");
if (!base) {
  console.error("Pass the site to check, e.g. npm run check:cards -- https://example.com");
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "5t0hmzzq",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-10-01",
  useCdn: false,
  perspective: "published",
});

async function main() {
  // The reference sits at a different depth depending on how the field was
  // written: the figure object nests the upload, an older plain image field
  // does not. Reading only one depth is what made an upload look missing
  // when it was there — so read every shape the field has ever had.
  const entries: {
    title: string;
    ref?: string;
    headerRef?: string;
    updated?: string;
  }[] = await client.fetch(
    `*[_type == "kbEntry" && count(string::split(_id, ".")) == 1] | order(_updatedAt desc)[0...6]{
       title,
       "ref": coalesce(
         image.asset.asset._ref,
         image.asset._ref,
         image._ref
       ),
       "headerRef": coalesce(
         articleImage.asset.asset._ref,
         articleImage.asset._ref,
         articleImage._ref
       ),
       "updated": _updatedAt
     }`
  );

  console.log("--- what Sanity holds (newest first) ---");
  for (const e of entries) {
    console.log(
      `${e.updated?.slice(0, 19)}  card: ${e.ref ? e.ref.slice(6, 26) + "…" : "EMPTY"}` +
        `  header: ${e.headerRef ? e.headerRef.slice(6, 26) + "…" : "EMPTY"}  ${e.title}`
    );
  }

  // A card image field left empty is not a caching problem: the grid falls
  // back to the shipped stock photograph, which is exactly what "the old
  // image" looks like on a phone.
  const cardless = entries.filter((e) => !e.ref && e.headerRef);
  if (cardless.length) {
    console.log("\n  ⚠ Header image uploaded but CARD image empty:");
    for (const e of cardless) console.log(`    ${e.title}`);
    console.log("    The grid shows the seeded photograph for these.");
  }

  console.log(`\n--- what ${base}/knowledge-base serves ---`);
  const response = await fetch(`${base}/knowledge-base`, { cache: "no-store" });
  console.log(
    "page:", response.status,
    "age:", response.headers.get("age"),
    "cache:", response.headers.get("x-vercel-cache"),
    "\ncache-control:", response.headers.get("cache-control")
  );

  const html = await response.text();
  // Sanity serves an asset at cdn.sanity.io/images/<project>/<dataset>/<id>-WxH.ext,
  // and Next wraps that in /_next/image?url=... — so the id appears in the
  // page URL-encoded. Match the id itself rather than the document's
  // "image-..." reference, which is spelled differently.
  // decodeURIComponent throws on a stray percent anywhere in the page, and a
  // page of marketing copy has plenty; decode only the escapes that matter.
  const readable = html.replace(/%2F/gi, "/").replace(/%3A/gi, ":");
  const ids = [
    ...new Set(
      [...readable.matchAll(/([a-f0-9]{32,})-(\d+x\d+)\.(\w+)/g)].map((m) => m[1])
    ),
  ];
  console.log(`\n${ids.length} distinct Sanity asset(s) referenced by the grid:`);
  for (const id of ids) {
    const known = entries.find((e) => e.ref?.includes(id));
    console.log(`  ${id}${known ? `  <- ${known.title}` : "  <- not among the six newest entries"}`);
  }

  const missing = entries.filter((e) => e.ref && !ids.some((id) => e.ref!.includes(id)));
  if (missing.length) {
    console.log("\n  ⚠ In Sanity but NOT referenced by the live grid:");
    for (const e of missing) console.log(`    ${e.title}`);
    console.log("  That is a stale page, not a stale browser.");
  } else if (entries.some((e) => e.ref)) {
    console.log("\n  ✓ Every uploaded card image is referenced by the live grid.");
    console.log("    A device showing an older picture is holding its own cached");
    console.log("    copy: the page being served is current.");
  } else {
    console.log("\n  No entry has a card image, so the grid is showing the seeded");
    console.log("  photographs. Nothing here is a caching problem.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

export {};
