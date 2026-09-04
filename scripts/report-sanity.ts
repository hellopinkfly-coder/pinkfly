/**
 * Read-only snapshot of what the dataset actually contains.
 *
 * Run it from the Actions tab ("Sanity report") when the site is not showing
 * content you expect. It answers the question the code cannot answer from a
 * developer machine: which documents are *published*, since an unpublished
 * document is invisible to the site by design.
 *
 *   npm run report:sanity
 *
 * It writes nothing. The token is only needed because a private dataset
 * refuses anonymous reads; a public dataset works without one.
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

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "5t0hmzzq",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-10-01",
  useCdn: false,
  perspective: "published",
  ...(process.env.SANITY_API_WRITE_TOKEN
    ? { token: process.env.SANITY_API_WRITE_TOKEN }
    : {}),
});

async function main() {
  const byType = await client.fetch<Record<string, number>>(`{
    "siteSettings": count(*[_type == "siteSettings"]),
    "region": count(*[_type == "region"]),
    "homePage": count(*[_type == "homePage"]),
    "aboutPage": count(*[_type == "aboutPage"]),
    "joinPage": count(*[_type == "joinPage"]),
    "eventsPage": count(*[_type == "eventsPage"]),
    "knowledgeBasePage": count(*[_type == "knowledgeBasePage"]),
    "policyPage": count(*[_type == "policyPage"]),
    "event": count(*[_type == "event"]),
    "kbEntry": count(*[_type == "kbEntry"]),
    "teamMember": count(*[_type == "teamMember"]),
    "initiative": count(*[_type == "initiative"]),
    "testimonial": count(*[_type == "testimonial"])
  }`);

  console.log("\n=== published documents by type ===");
  for (const [type, count] of Object.entries(byType)) {
    console.log(`${count === 0 ? "  ⚠ " : "    "}${type.padEnd(20)} ${count}`);
  }

  const kb = await client.fetch<{ category: string; count: number }[]>(
    `*[_type == "kbEntry"] { category } | { category } [0...100]`
  );
  const perCategory = kb.reduce<Record<string, number>>((acc, entry) => {
    acc[entry.category] = (acc[entry.category] ?? 0) + 1;
    return acc;
  }, {});

  console.log("\n=== published Knowledge Base entries per category ===");
  console.log("(a category with 0 has no rail on the Knowledge Base page)");
  for (const id of ["articles", "business-news", "government-policies"]) {
    const count = perCategory[id] ?? 0;
    console.log(`${count === 0 ? "  ⚠ " : "    "}${id.padEnd(22)} ${count}`);
  }
  const unknown = Object.keys(perCategory).filter(
    (id) => !["articles", "business-news", "government-policies"].includes(id)
  );
  if (unknown.length > 0) {
    console.log(`  ⚠ entries with an unrecognised category: ${unknown.join(", ")}`);
  }

  const rails = await client.fetch<{ id?: string; title?: string }[] | null>(
    `*[_type == "knowledgeBasePage"][0].categories[]{ id, title }`
  );
  console.log("\n=== category rails configured on the Knowledge Base page ===");
  console.log("(each rail's key must match the entry categories above)");
  for (const rail of rails ?? []) {
    console.log(`    ${String(rail.id).padEnd(22)} ${rail.title ?? ""}`);
  }
  if (!rails) console.log("  ⚠ the Knowledge Base page document is not published");

  const events = await client.fetch<number>(`count(*[_type == "event"])`);
  console.log(`\n=== events ===\n    published events       ${events}\n`);

  await reportAnonymous();
  await reportLivePage();
  await reportFreshness();
  await reportRecentEdits();
  await reportImages();
}

/**
 * The same counts read the way the site reads them: no token at all.
 *
 * A gap between this and the counts above is a read-permission problem in
 * Sanity, not a bug in the site — the site has no token and never will.
 */
async function reportAnonymous() {
  const anon = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "5t0hmzzq",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
    apiVersion: "2024-10-01",
    useCdn: false,
    perspective: "published",
  });

  console.log("\n=== the same dataset read WITHOUT a token (as the site does) ===");
  try {
    const counts = await anon.fetch<Record<string, number>>(`{
      "siteSettings": count(*[_type == "siteSettings"]),
      "knowledgeBasePage": count(*[_type == "knowledgeBasePage"]),
      "kbEntry": count(*[_type == "kbEntry"]),
      "event": count(*[_type == "event"]),
      "policyPage": count(*[_type == "policyPage"]),
      "teamMember": count(*[_type == "teamMember"])
    }`);
    for (const [type, count] of Object.entries(counts)) {
      console.log(`${count === 0 ? "  ⚠ " : "    "}${type.padEnd(20)} ${count}`);
    }
    const ids = await anon.fetch<string[]>(`*[_type == "kbEntry"][0...3]._id`);
    console.log(`    sample kbEntry ids     ${JSON.stringify(ids)}`);
  } catch (error) {
    console.log(`  ⚠ anonymous read failed: ${(error as Error).message}`);
    console.log("    That means the dataset is private. The site cannot read it at all.");
  }
}

/**
 * What the deployed site is actually serving.
 *
 * The dataset being right does not prove the page is right, and a developer
 * sandbox often cannot reach the deployment. CI can, so the check runs here.
 */
async function reportLivePage() {
  const base = process.env.SITE_URL ?? "https://pinkfly.vercel.app";
  const url = `${base}/knowledge-base`;

  let html: string;
  try {
    const response = await fetch(url, { headers: { "cache-control": "no-cache" } });
    console.log(`\n=== live page: ${url} ===`);
    console.log(`    HTTP ${response.status}`);
    if (!response.ok) return;
    html = await response.text();
  } catch (error) {
    console.log(`\n=== live page: ${url} ===`);
    console.log(`  ⚠ could not be fetched: ${(error as Error).message}`);
    return;
  }

  // What the deployment itself says it is reading — the decisive number when
  // the dataset is healthy but the page is empty.
  try {
    const status = await fetch(`${base}/api/cms-status`, {
      headers: { "cache-control": "no-cache" },
    });
    if (status.ok) {
      const body = (await status.json()) as Record<string, unknown>;
      console.log(`    /api/cms-status        ${JSON.stringify(body)}`);
    } else {
      console.log(`    /api/cms-status        HTTP ${status.status} (not deployed yet?)`);
    }
  } catch (error) {
    console.log(`    /api/cms-status        unreachable: ${(error as Error).message}`);
  }

  const title = /<title>([^<]*)<\/title>/.exec(html)?.[1] ?? "(none)";
  console.log(`    <title>                ${title}`);

  for (const heading of ["Recent Articles", "Business News", "Government Policies"]) {
    const count = html.split(heading).length - 1;
    console.log(
      `${count === 0 ? "  ⚠ " : "    "}${heading.padEnd(22)} ${count} occurrence(s) in the HTML`
    );
  }

  const links = new Set(
    [...html.matchAll(/href="(?:\/[a-z]+)?\/knowledge-base\/[a-z-]+\/[a-z0-9-]+"/g)].map(
      (match) => match[0]
    )
  );
  console.log(`    article links          ${links.size}`);
}

/**
 * Is the deployment serving what Sanity currently holds?
 *
 * Reads a handful of fields anonymously — exactly as the site does — and then
 * checks whether the live HTML contains them. A value present in Sanity but
 * absent from the page means the deployment is serving a cached render, which
 * is a caching problem rather than a content or permissions one.
 *
 * It also follows the first event and the first article through to their own
 * detail pages, so a card that links nowhere shows up as an HTTP status.
 */
async function reportFreshness() {
  const base = process.env.SITE_URL ?? "https://pinkfly.vercel.app";
  const anon = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "5t0hmzzq",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
    apiVersion: "2024-10-01",
    useCdn: false,
    perspective: "published",
  });

  console.log("\n=== is the live site serving what Sanity holds? ===");

  const cms = await anon.fetch<{
    siteTitle?: string;
    homeSeoTitle?: string;
    heroTitle?: string;
    event?: { slug?: string; title?: string };
    entry?: { category?: string; slug?: string; title?: string };
  }>(`{
    "siteTitle": *[_type == "siteSettings"][0].title,
    "homeSeoTitle": *[_type == "homePage"][0].seo.title,
    "heroTitle": *[_type == "homePage"][0].hero.title,
    "event": *[_type == "event"][0]{ "slug": slug.current, title },
    "entry": *[_type == "kbEntry"][0]{ category, "slug": slug.current, title }
  }`);

  const home = await get(base + "/");
  console.log(`    GET /                  HTTP ${home.status}`);
  console.log(`    <title> served         ${title(home.body)}`);

  for (const [label, value] of [
    ["siteSettings.title", cms.siteTitle],
    ["homePage.seo.title", cms.homeSeoTitle],
    ["homePage.hero.title", cms.heroTitle],
  ] as const) {
    if (!value) {
      console.log(`    ${label.padEnd(22)} (not set in Sanity)`);
      continue;
    }
    const present = home.body.includes(escapeHtml(value)) || home.body.includes(value);
    console.log(
      `${present ? "    " : "  ⚠ "}${label.padEnd(22)} ${present ? "on the page" : "NOT on the page"} — Sanity says ${JSON.stringify(value)}`
    );
  }

  const events = await anon.fetch<{ title: string; slug: string }[]>(
    `*[_type == "event"] | order(startsAt asc) { title, "slug": slug.current }`
  );
  console.log("\n=== every published event title, against the live events page ===");
  const eventsPage = await get(base + "/events");
  console.log(`    GET /events            HTTP ${eventsPage.status}`);
  for (const event of events) {
    const present =
      eventsPage.body.includes(escapeHtml(event.title)) ||
      eventsPage.body.includes(event.title);
    console.log(
      `${present ? "    " : "  ⚠ "}${present ? "on the page    " : "NOT on the page"} ${event.title}`
    );
  }

  console.log("\n=== detail pages behind the cards ===");
  if (cms.event?.slug) {
    const res = await get(`${base}/events/${cms.event.slug}`);
    console.log(
      `${res.status === 200 ? "    " : "  ⚠ "}/events/${cms.event.slug} → HTTP ${res.status}` +
        (res.status === 200 ? `  title ${title(res.body)}` : "")
    );
  } else {
    console.log("  ⚠ no published event to follow");
  }
  if (cms.entry?.slug) {
    const path = `/knowledge-base/${cms.entry.category}/${cms.entry.slug}`;
    const res = await get(base + path);
    console.log(
      `${res.status === 200 ? "    " : "  ⚠ "}${path} → HTTP ${res.status}` +
        (res.status === 200 ? `  title ${title(res.body)}` : "")
    );
  } else {
    console.log("  ⚠ no published article to follow");
  }
  console.log("");
}

/**
 * What was edited most recently, and whether the site can see it.
 *
 * When an editor says a change is not showing, this is the first question:
 * did the edit land on a document the site reads at all? Two ways it may not
 * have. A dotted `_id` is a path, and Sanity keeps path documents private, so
 * the site — which holds no token — cannot read it however published it is.
 * And an edit that was saved but never published stays a draft, which the
 * site is configured never to see.
 */
async function reportRecentEdits() {
  const withToken = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "5t0hmzzq",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
    apiVersion: "2024-10-01",
    useCdn: false,
    // `raw` so drafts are visible here — the point is to spot an edit that
    // only exists as a draft, which the site by design cannot render.
    perspective: "raw",
    ...(process.env.SANITY_API_WRITE_TOKEN
      ? { token: process.env.SANITY_API_WRITE_TOKEN }
      : {}),
  });

  console.log("\n=== most recently edited documents ===");
  console.log("(a dotted id or a drafts. prefix is invisible to the site)");

  type Edited = { _id: string; _type: string; _updatedAt: string; label?: string };
  let recent: Edited[];
  try {
    recent = await withToken.fetch<Edited[]>(
      `*[!(_type match "system.*")] | order(_updatedAt desc) [0...12] {
         _id, _type, _updatedAt, "label": coalesce(title, name, seo.title, slug.current)
       }`
    );
  } catch (error) {
    console.log(`  ⚠ could not be read: ${(error as Error).message}`);
    return;
  }

  for (const doc of recent) {
    const draft = doc._id.startsWith("drafts.");
    const bare = doc._id.replace(/^drafts\./, "");
    const pathScoped = bare.includes(".");
    const problem = draft
      ? "DRAFT — publish it"
      : pathScoped
        ? "dotted id — the site cannot read it"
        : "";
    console.log(
      `${problem ? "  ⚠ " : "    "}${doc._updatedAt}  ${doc._type.padEnd(18)} ${doc._id}` +
        (doc.label ? `\n        ${doc.label}` : "") +
        (problem ? `\n        ${problem}` : "")
    );
  }
}

/**
 * Which image each Knowledge Base entry actually holds, and whether the live
 * page is serving it.
 *
 * "I changed the image and the old one is still there" has several possible
 * causes that look identical from the outside: the edit was never published,
 * it landed on a document the site cannot read, the field the site renders is
 * not the field that was edited, or the page is cached. Printing the asset id
 * Sanity holds beside the asset id in the page HTML separates them — if the
 * ids match, the site is current and the browser is not.
 */
async function reportImages() {
  const base = process.env.SITE_URL ?? "https://pinkfly.vercel.app";
  const anon = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "5t0hmzzq",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
    apiVersion: "2024-10-01",
    useCdn: false,
    perspective: "published",
  });

  type Entry = {
    _id: string;
    title?: string;
    category?: string;
    slug?: string;
    assetRef?: string;
    externalUrl?: string;
  };

  const entries = await anon.fetch<Entry[]>(
    `*[_type == "kbEntry" && hidden != true]{
       _id, title, category, "slug": slug.current,
       "assetRef": image.asset._ref,
       "externalUrl": image.url
     }`
  );

  console.log("\n=== the image each Knowledge Base entry holds ===");
  console.log("(upload wins over external URL — that is what the site renders)");
  for (const entry of entries) {
    const source = entry.assetRef
      ? `upload  ${entry.assetRef}`
      : entry.externalUrl
        ? `external  ${entry.externalUrl.slice(0, 70)}`
        : "none — falls back to the site placeholder";
    console.log(`    ${entry.title ?? entry._id}`);
    console.log(`        ${source}`);
  }

  // The same field read with drafts visible. An upload that appears here but
  // not above was saved and never published, which looks exactly like "the
  // image did not change" from the website.
  const withToken = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "5t0hmzzq",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
    apiVersion: "2024-10-01",
    useCdn: false,
    perspective: "raw",
    ...(process.env.SANITY_API_WRITE_TOKEN
      ? { token: process.env.SANITY_API_WRITE_TOKEN }
      : {}),
  });

  try {
    const drafts = await withToken.fetch<Entry[]>(
      `*[_type == "kbEntry" && _id in path("drafts.**")]{
         _id, title, "assetRef": image.asset._ref, "externalUrl": image.url
       }`
    );
    console.log("\n=== unpublished drafts of Knowledge Base entries ===");
    if (drafts.length === 0) {
      console.log("    none — every edit has been published");
    }
    for (const draft of drafts) {
      console.log(`  ⚠ ${draft.title ?? draft._id}`);
      console.log(
        `        ${draft.assetRef ? `upload  ${draft.assetRef}` : draft.externalUrl ? "external URL" : "no image"} — NOT published, so the site cannot see it`
      );
    }
  } catch (error) {
    console.log(`\n  ⚠ could not read drafts: ${(error as Error).message}`);
  }

  const withUpload = entries.filter((entry) => entry.assetRef);
  if (withUpload.length === 0) {
    console.log("\n  ⚠ No entry has an uploaded image, so every card and hero is");
    console.log("    showing the seeded external photo. An upload in the Studio's");
    console.log("    Image field is what replaces it.");
    return;
  }

  console.log("\n=== is the live page serving that image? ===");
  for (const entry of withUpload.slice(0, 4)) {
    const path = `/knowledge-base/${entry.category}/${entry.slug}`;
    const page = await get(base + path);
    if (page.status !== 200) {
      console.log(`  ⚠ ${path} → HTTP ${page.status}`);
      continue;
    }
    // The asset id survives into the optimiser's URL, percent-encoded.
    const id = entry.assetRef!.replace(/^image-/, "").split("-")[0];
    const present = page.body.includes(id);
    console.log(
      `${present ? "    " : "  ⚠ "}${present ? "serving it   " : "NOT serving it"} ${path}`
    );
  }
  console.log("");
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

function title(html: string) {
  return /<title>([^<]*)<\/title>/.exec(html)?.[1] ?? "(none)";
}

async function get(url: string) {
  try {
    const response = await fetch(url, { headers: { "cache-control": "no-cache" } });
    return { status: response.status, body: await response.text() };
  } catch (error) {
    console.log(`  ⚠ ${url} could not be fetched: ${(error as Error).message}`);
    return { status: 0, body: "" };
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
