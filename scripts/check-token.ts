/**
 * What can the Sanity token in the environment actually do?
 *
 * Two features depend on it — posting comments from the website, and
 * deploying the Studio Sanity hosts — and both fail in ways that look like
 * bugs when the real cause is the token: not a member of the project, or a
 * member without the role the action needs. This asks Sanity directly and
 * prints the answer. It writes nothing.
 *
 *   npm run check:token
 */
const token = process.env.SANITY_API_WRITE_TOKEN ?? process.env.SANITY_AUTH_TOKEN;
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "5t0hmzzq";

if (!token) {
  console.log("No token in the environment. Nothing to check.");
  process.exit(0);
}
console.log(`token: ${token.length} characters, starts "${token.slice(0, 4)}…"`);

async function get(url: string) {
  const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  const text = await response.text();
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    body = text.slice(0, 300);
  }
  return { status: response.status, body };
}

async function main() {
  console.log("\n--- who the token is ---");
  const me = await get("https://api.sanity.io/v2021-06-07/users/me");
  console.log(me.status, JSON.stringify(me.body).slice(0, 500));

  console.log(`\n--- membership of project ${projectId} ---`);
  const project = await get(`https://api.sanity.io/v2021-06-07/projects/${projectId}`);
  if (project.status !== 200) {
    console.log(project.status, JSON.stringify(project.body).slice(0, 500));
    console.log(
      "\nThe token cannot see the project. That is the same failure the comment\n" +
        "form reports, and a Studio deploy would fail the same way. Create a new\n" +
        "token in this project (sanity.io/manage -> API -> Tokens)."
    );
    return;
  }
  const data = project.body as { displayName?: string; members?: { id: string; role?: string; roles?: { name: string }[] }[] };
  console.log("project:", data.displayName);

  console.log("\n--- what the token may do ---");
  const permissions = await get(
    `https://api.sanity.io/v2021-06-07/projects/${projectId}/permissions/me`
  );
  console.log(permissions.status, JSON.stringify(permissions.body).slice(0, 800));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

export {};
