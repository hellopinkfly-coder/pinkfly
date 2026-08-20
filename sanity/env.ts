/**
 * Sanity environment.
 *
 * The site is designed to build and run whether or not a Sanity project is
 * configured. When `projectId` is missing every loader falls back to the seed
 * content in `src/config` — so a fresh clone, a preview build and CI all work
 * before the CMS is wired up. Set the two public variables and the CMS takes
 * over with no code change.
 */
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-10-01";

/** True once a project is configured — the single switch every loader reads. */
export const cmsEnabled = projectId.length > 0;

/** Write token, server-only. Used by the seed script, never by the browser. */
export const token = process.env.SANITY_API_WRITE_TOKEN ?? "";
