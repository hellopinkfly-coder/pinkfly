/**
 * Do robots.txt and the sitemap describe the site as it actually is?
 *
 * The sitemap used to be generated from the seed data, so it listed articles
 * nobody could read and omitted every one published in the Studio. Reading
 * the file proves nothing on its own — this fetches it, then fetches the
 * Knowledge Base and Events pages and compares what they link to against
 * what the sitemap offers, so a missing or stale URL is named rather than
 * counted.
 *
 *   npm run check:seo -- https://<deployment>
 */
const base = (process.argv.slice(2).find((a) => a.startsWith("http")) ?? "").replace(/\/+$/, "");
if (!base) {
  console.error("Pass the site to check, e.g. npm run check:seo -- https://example.com");
  process.exit(1);
}

/** Every <loc> in the sitemap, split into the origin it names and its path. */
function locs(xml: string): { origins: Set<string>; paths: string[] } {
  const origins = new Set<string>();
  const paths: string[] = [];
  for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    // Parsed rather than string-replaced. Stripping the checked site's own
    // address left every path untouched when the sitemap named a different
    // domain, and each one then read as an article missing from the sitemap —
    // a wall of false findings hiding the one real fault, the wrong domain.
    try {
      const url = new URL(m[1].trim());
      origins.add(url.origin);
      paths.push(url.pathname === "" ? "/" : url.pathname.replace(/(.)\/$/, "$1"));
    } catch {
      origins.add("(unparseable)");
      paths.push(m[1].trim());
    }
  }
  return { origins, paths };
}

/** The article and event links a listing page actually renders. */
function links(html: string, prefix: string): Set<string> {
  const found = new Set<string>();
  for (const m of html.matchAll(/href="([^"]+)"/g)) {
    // An anchor and a query string lead to the same page, so "#register" is
    // not a second URL the sitemap is missing.
    const href = m[1].split(/[?#]/)[0].replace(/(.)\/$/, "$1");
    if (!href.startsWith(prefix)) continue;
    // Only leaf pages: /knowledge-base/<category>/<slug>, /events/<slug>.
    const depth = href.split("/").filter(Boolean).length;
    if (prefix === "/knowledge-base/" ? depth === 3 : depth === 2) found.add(href);
  }
  return found;
}

async function text(path: string) {
  const response = await fetch(`${base}${path}`);
  if (!response.ok) throw new Error(`${path} → HTTP ${response.status}`);
  return response.text();
}

async function main() {
  console.log(`Checking ${base}\n`);

  const robots = await text("/robots.txt");
  console.log("robots.txt");
  console.log(robots.trim().split("\n").map((l) => `  ${l}`).join("\n"));

  for (const path of ["/studio", "/api/"]) {
    const blocked = robots.includes(`Disallow: ${path}`);
    console.log(`  ${blocked ? "✓" : "⚠"} ${path} ${blocked ? "is" : "is NOT"} disallowed`);
  }
  const sitemapLine = robots.match(/Sitemap:\s*(\S+)/)?.[1];
  console.log(`  ${sitemapLine ? "✓" : "⚠"} sitemap: ${sitemapLine ?? "not advertised"}`);

  const xml = await text("/sitemap.xml");
  const { origins, paths } = locs(xml);
  console.log(`\nsitemap.xml  ${paths.length} URLs`);

  // The address the sitemap advertises has to be the one the site answers on.
  // Naming a domain that is not serving the site hands Google a list of URLs
  // that lead nowhere, and nothing on the page itself would ever show it.
  const wrong = [...origins].filter((origin) => origin !== base);
  console.log(
    wrong.length === 0
      ? `  ✓ every URL is on ${base}`
      : `  ⚠ URLs point at ${wrong.join(", ")}, not ${base} — set NEXT_PUBLIC_APP_URL\n` +
          "      to the address the site actually answers on, or correct\n" +
          "      PRODUCTION_URL in src/config/site.ts."
  );
  if (sitemapLine && !sitemapLine.startsWith(base)) {
    console.log(`  ⚠ robots.txt advertises the sitemap at ${sitemapLine}`);
  }

  const leaked = paths.filter((p) => p.startsWith("/studio") || p.startsWith("/api"));
  console.log(
    leaked.length
      ? `  ⚠ lists ${leaked.length} URL(s) robots disallows: ${leaked.join(", ")}`
      : "  ✓ lists no Studio or API URL"
  );

  // What the live pages link to is the truth the sitemap is measured against.
  const listed = new Set(paths);
  let missing = 0;
  for (const [page, prefix] of [
    ["/knowledge-base", "/knowledge-base/"],
    ["/events", "/events/"],
  ] as const) {
    const live = links(await text(page), prefix);
    const absent = [...live].filter((href) => !listed.has(href));
    missing += absent.length;
    console.log(`\n${page}  ${live.size} link(s) on the page`);
    if (absent.length === 0) {
      console.log("  ✓ every one is in the sitemap");
    } else {
      console.log(`  ⚠ ${absent.length} not in the sitemap:`);
      for (const href of absent) console.log(`      ${href}`);
    }
  }

  // The reverse: a sitemap URL that no longer resolves is a dead promise.
  const leaves = paths.filter(
    (p) =>
      (p.startsWith("/knowledge-base/") && p.split("/").filter(Boolean).length === 3) ||
      (p.startsWith("/events/") && p.split("/").filter(Boolean).length === 2)
  );
  const dead: string[] = [];
  for (const path of leaves) {
    const response = await fetch(`${base}${path}`, { method: "HEAD" });
    if (!response.ok) dead.push(`${path} → HTTP ${response.status}`);
  }
  console.log(`\nFetched ${leaves.length} listed article/event page(s)`);
  console.log(
    dead.length === 0
      ? "  ✓ all resolve"
      : `  ⚠ ${dead.length} listed but not reachable:\n      ${dead.join("\n      ")}`
  );

  if (missing || dead.length || leaked.length || wrong.length) {
    console.log("\n⚠ The sitemap and the site disagree — the lines above say how.");
    process.exit(1);
  }
  console.log("\n✓ robots.txt and the sitemap match the live site.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

export {};
