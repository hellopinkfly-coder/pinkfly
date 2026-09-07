/**
 * Can the site actually reach Supabase, and will the form's insert succeed?
 *
 * The credentials being present in the code proves nothing: the write still
 * needs the table to exist and a row level security policy that permits an
 * anonymous insert. This performs the exact request the subscribe form makes,
 * with a throwaway address, and reports what Supabase answers — so "connected"
 * is something observed rather than assumed.
 *
 *   npm run check:supabase
 */
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, NEWSLETTER_TABLE } from "../src/lib/supabase";

const headers = {
  apikey: SUPABASE_PUBLISHABLE_KEY,
  Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
  "Content-Type": "application/json",
  Prefer: "return=representation",
};

async function main() {
  console.log(`project  ${SUPABASE_URL}`);
  console.log(`table    ${NEWSLETTER_TABLE}\n`);

  const read = await fetch(
    `${SUPABASE_URL}/rest/v1/${NEWSLETTER_TABLE}?select=*&limit=1`,
    { headers }
  );
  console.log(`read   HTTP ${read.status}  ${(await read.text()).slice(0, 300)}`);

  // A real insert, because a readable table can still reject writes — which is
  // the only operation the form performs.
  const email = `connection-check+${Date.now()}@pinkfly.invalid`;
  const write = await fetch(`${SUPABASE_URL}/rest/v1/${NEWSLETTER_TABLE}`, {
    method: "POST",
    headers,
    body: JSON.stringify({ email }),
  });
  console.log(`insert HTTP ${write.status}  ${(await write.text()).slice(0, 300)}`);
  if (write.ok) console.log(`\n  ⚠ test row written: ${email} — delete it when you are done`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
