import { cache } from "react";
import { client } from "../../../sanity/client";
import { cmsEnabled } from "../../../sanity/env";

/**
 * One guarded fetch, deduplicated per request.
 *
 * The result separates two things the old `T | null` return could not tell
 * apart, and which mean opposite things:
 *
 *  - `live: true` — Sanity answered. `data` is the truth, and `null` is a real
 *    answer: the document is unpublished, deleted, or never existed. Nothing
 *    should be rendered for it.
 *  - `live: false` — Sanity could not be reached, or no project is configured.
 *    `data` says nothing at all, so loaders fall back to the seed content and
 *    the marketing site stays up through an outage.
 *
 * Collapsing those two cases is what made unpublished documents keep showing:
 * a missing document looked exactly like an outage, so the seed was rendered
 * in its place.
 *
 * `cache` means several components asking for the same document in one render
 * share a single request. The Next data cache holds each query for 60 seconds
 * and is tagged `sanity`, so the webhook in `src/app/api/revalidate/route.ts`
 * can purge it the moment an editor publishes.
 */
export type CmsResult<T> = {
  /** True when Sanity answered — including when the answer was "no document". */
  live: boolean;
  data: T | null;
};

export const cmsFetch = cache(async function cmsFetch<T>(
  query: string,
  params: Record<string, unknown> = {}
): Promise<CmsResult<T>> {
  if (!cmsEnabled || !client) return { live: false, data: null };
  try {
    const data = await client.fetch<T>(query, params, {
      next: { revalidate: 60, tags: ["sanity"] },
    });
    return { live: true, data };
  } catch (error) {
    console.error("[sanity] query failed, falling back to seed content:", error);
    return { live: false, data: null };
  }
});
