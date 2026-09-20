/**
 * Is the newsletter dialog actually in what production serves?
 *
 * "I didn't see the popup" has three very different causes — the code is not
 * deployed, the browser is suppressing it after an earlier dismissal, or the
 * timer is broken — and guessing between them wastes everyone's time. This
 * settles the first one: it fetches the homepage, follows every script the
 * page loads, and looks for the dialog's own copy in them.
 *
 * It cannot see a timer fire; that needs a browser. What it can say for
 * certain is whether the code is there to fire at all.
 *
 *   npm run check:popup -- https://<deployment>
 */
const base = (process.argv.slice(2).find((a) => a.startsWith("http")) ?? "").replace(/\/+$/, "");
if (!base) {
  console.error("Pass the site to check, e.g. npm run check:popup -- https://example.com");
  process.exit(1);
}

/**
 * Something structural, not a line of copy.
 *
 * It used to look for the headline. Then the headline moved into the Studio,
 * the bundle stopped containing it, and this reported the dialog missing from
 * a deployment that had it — a check that fails when the thing it checks is
 * working is worse than no check. The heading's id is part of the component,
 * so it survives every edit an editor can make.
 */
const FINGERPRINT = "welcome-dialog-title";
/** How long it waits before opening, as the bundle spells the number. */
const DELAYS = ["3000", "3e3", "12000", "12e3"];

async function main() {
  console.log(`Checking ${base}\n`);

  const html = await (await fetch(base)).text();

  // Every script the page pulls in, absolute.
  const scripts = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)]
    .map((m) => m[1])
    .map((src) => (src.startsWith("http") ? src : `${base}${src}`));
  console.log(`${scripts.length} script(s) on the homepage`);

  let found: string | null = null;
  let delay: string | null = null;

  for (const src of scripts) {
    const body = await (await fetch(src)).text();
    if (!body.includes(FINGERPRINT)) continue;
    found = src;
    // The delay sits right next to the setTimeout that uses it.
    for (const candidate of DELAYS) {
      if (new RegExp(`setTimeout\\([^)]*,\\s*${candidate}\\)`).test(body)) {
        delay = candidate;
        break;
      }
    }
    break;
  }

  if (!found) {
    console.log(
      "\n⚠ The dialog is NOT in what this deployment serves.\n" +
        "    Either the deploy predates it, or the build dropped it."
    );
    process.exit(1);
  }

  console.log(`\n✓ The dialog is in the bundle: ${found.replace(base, "")}`);
  console.log(
    delay
      ? `✓ It opens ${Number(delay.replace("e3", "000")) / 1000}s after the page mounts`
      : "  (could not read the delay out of the minified bundle)"
  );
  console.log(
    "\nIf it still does not appear in a browser, it is being suppressed:\n" +
      "  it shows once per browser — a month after a dismissal, a year after\n" +
      "  subscribing. Open a private window to see it fresh, or clear this\n" +
      "  site's data. It also never shows on /join."
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

export {};
