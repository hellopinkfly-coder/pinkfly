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
/**
 * How long the Next data cache may hold a query.
 *
 * Zero, which means do not cache: every request reads Sanity, so a change
 * published in the Studio is on the page at the next refresh. That is what an
 * editor expects, and until now was not what happened — the cache served the
 * previous render first and refreshed behind it, so a replaced image took two
 * refreshes to appear.
 *
 * The cost is a Sanity request per render rather than one per window, which is
 * the right trade while the site is being built and edited constantly. Once
 * the publish webhook in `src/app/api/revalidate/route.ts` is configured
 * (it needs SANITY_REVALIDATE_SECRET), put this back to 60: the webhook
 * purges the `sanity` tag on publish, which gives immediate updates *and* a
 * cached site. Changing this one number is the whole switch.
 *
 * Exported so `/api/cms-status` reports it rather than leaving editors to
 * guess how long to wait.
 */
export const CMS_REVALIDATE_SECONDS = 0;

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
      next: { revalidate: CMS_REVALIDATE_SECONDS, tags: ["sanity"] },
    });
    return { live: true, data };
  } catch (error) {
    console.error("[sanity] query failed, falling back to seed content:", error);
    return { live: false, data: null };
  }
});
