/**
 * Does the comment form actually save a comment?
 *
 * The token being set is not the same as the write working: the route also
 * needs the token to reach the deployment it runs in, and the token needs
 * write access to this dataset. This posts one clearly-labelled test comment
 * through the real endpoint and reports what comes back, so "connected" is
 * observed rather than assumed.
 *
 * The comment is created unapproved, like every other, so it is not on the
 * site — delete it in the Studio when you are done.
 *
 *   npm run check:comments -- https://<deployment>
 */
import { createClient } from "@sanity/client";

const base = (process.argv.slice(2).find((a) => a.startsWith("http")) ?? "").replace(/\/+$/, "");
if (!base) {
  console.error("Pass the site to check, e.g. npm run check:comments -- https://example.com");
  process.exit(1);
}

const anon = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "5t0hmzzq",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-10-01",
  useCdn: false,
  perspective: "published",
});

async function main() {
  const entry = await anon.fetch<{ _id: string; title?: string } | null>(
    `*[_type == "kbEntry" && hidden != true][0]{ _id, title }`
  );
  if (!entry) {
    console.log("No published article to comment on — nothing to test.");
    return;
  }

  // Ask the deployment what it can see before trying to write, so a refusal
  // can be attributed rather than guessed at. The status code is printed even
  // when the answer is unusable: a 404 or 405 here means the deployment
  // predates this endpoint, which is a different problem from a refused write
  // and was invisible while only a successful answer was reported.
  try {
    const status = await fetch(`${base}/api/comments`);
    console.log(`status   HTTP ${status.status}  ${(await status.text()).slice(0, 200)}`);
  } catch (error) {
    console.log(`status   unreachable  ${error}`);
  }

  // A page that exists only in recent code, to date the deployment.
  const marker = await fetch(`${base}/knowledge-base/articles`);
  console.log(`category page  HTTP ${marker.status}  (404 = deployment predates it)`);

  console.log(`site     ${base}`);
  console.log(`article  ${entry.title ?? entry._id}\n`);

  const res = await fetch(`${base}/api/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      entryId: entry._id,
      name: "Connection check",
      email: "connection-check@pinkfly.invalid",
      body: `Automated check that the comment form saves. Sent ${new Date().toISOString()}. Safe to delete.`,
    }),
  });

  const text = (await res.text()).slice(0, 300);
  console.log(`POST /api/comments  HTTP ${res.status}  ${text}`);

  // A preview deployment sits behind Vercel Authentication, so a request from
  // outside a signed-in browser never reaches the route. That says nothing
  // about the token or the code, and must not be reported as if it did.
  if (res.status === 401 && text.includes("Protected deployment")) {
    console.log("\n  ⚠ This deployment is protected by Vercel Authentication,");
    console.log("    so the check cannot reach it. Test it in a signed-in browser,");
    console.log("    or run this against production.");
    return;
  }
  if (res.status === 503) {
    console.log("\n  ⚠ The deployment has no write token. Set SANITY_API_WRITE_TOKEN");
    console.log("    for this environment in Vercel and redeploy.");
    return;
  }
  if (!res.ok) {
    console.log("\n  ⚠ The write failed. The response above says why.");
    return;
  }

  const pending = await anon.fetch<number>(
    `count(*[_type == "comment" && approved == true])`
  );
  console.log("\n  ✓ saved — it is waiting in the Studio under Comments →");
  console.log("    Awaiting approval. Delete the check comment when you are done.");
  console.log(`  ${pending} comment(s) are currently approved and on the site.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
