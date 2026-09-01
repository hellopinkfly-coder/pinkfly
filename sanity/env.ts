/**
 * Sanity environment.
 *
 * The site is designed to build and run whether or not a Sanity project is
 * configured. When `projectId` is missing every loader falls back to the seed
 * content in `src/config` — so a fresh clone, a preview build and CI all work
 * before the CMS is wired up.
 *
 * The Pinkfly project id and dataset are the defaults, so every deploy is
 * connected to the CMS without extra configuration. Both stay overridable by
 * environment variable for a different project or dataset. Only the write
 * token is secret, and it lives in the environment alone.
 */
export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "5t0hmzzq";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-10-01";

/** True once a project is configured — the single switch every loader reads. */
export const cmsEnabled = projectId.length > 0;

/** Write token, server-only. Used by the seed script, never by the browser. */
export const token = process.env.SANITY_API_WRITE_TOKEN ?? "";
