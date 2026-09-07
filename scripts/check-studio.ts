/**
 * Does the deployed Studio carry the current schema?
 *
 * The Studio at /studio is built into the site, so a schema change reaches it
 * only when the site is deployed — and a browser that already has the old
 * bundle keeps showing the old fields. This fetches the deployment's own
 * JavaScript and looks for the field titles, which answers "is it deployed?"
 * separately from "is my browser showing it?".
 *
 *   npm run check:studio -- https://pinkfly.vercel.app
 */
const base = (process.argv.slice(2).find((a) => a.startsWith("http")) ?? "").replace(/\/+$/, "");
if (!base) {
  console.error("Pass the site to check, e.g. npm run check:studio -- https://example.com");
  process.exit(1);
}

/** The strings that only exist if the split image fields are deployed. */
const WANTED = [
  "Card image — Knowledge Base grid",
  "Header image — the article page",
  "Card image — Events listing",
  "Header image — the event page",
];

async function main() {
  console.log(`site ${base}\n`);

  const html = await (await fetch(`${base}/studio`)).text();
  const chunks = [...new Set(
    [...html.matchAll(/\/_next\/static\/[^"']+?\.js/g)].map((m) => m[0])
  )];
  console.log(`${chunks.length} script(s) referenced by /studio`);

  const found = new Set<string>();
  let scanned = 0;

  for (const chunk of chunks) {
    const res = await fetch(`${base}${chunk}`);
    if (!res.ok) continue;
    const body = await res.text();
    scanned += 1;
    for (const want of WANTED) {
      // The em dash may be escaped in the bundle, so match on the halves.
      const [head] = want.split(" — ");
      if (body.includes(head) && body.includes(want.split(" — ")[1])) found.add(want);
    }
  }

  console.log(`scanned ${scanned}\n`);
  for (const want of WANTED) {
    console.log(`  ${found.has(want) ? "✓" : "✗"} ${want}`);
  }

  if (found.size === WANTED.length) {
    console.log("\n  The deployment has the split image fields. A Studio still");
    console.log("  showing one field is a cached bundle — hard-refresh it.");
  } else if (found.size === 0) {
    console.log("\n  The deployment does not have them. Either it predates the");
    console.log("  merge, or the Studio being used is a separate deployment.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
