import { cache } from "react";
import { client } from "../../../sanity/client";
import { cmsEnabled } from "../../../sanity/env";

/**
 * One guarded fetch, deduplicated per request.
 *
 * A CMS outage must not take the marketing site down, so a failed query is
 * logged and returns `null` — every loader then falls back to seed content
 * and the page still renders. `cache` means several components asking for
 * the same document in one render share a single request.
 */
export const cmsFetch = cache(async function cmsFetch<T>(
  query: string,
  params: Record<string, unknown> = {}
): Promise<T | null> {
  if (!cmsEnabled || !client) return null;
  try {
    return await client.fetch<T>(query, params, {
      next: { revalidate: 60, tags: ["sanity"] },
    });
  } catch (error) {
    console.error("[sanity] query failed, falling back to seed content:", error);
    return null;
  }
});
