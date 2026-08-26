import { createClient, type SanityClient } from "next-sanity";
import { apiVersion, dataset, projectId, cmsEnabled } from "./env";

/**
 * Read-only client used by every loader. `null` when no project is
 * configured, which is what makes the seed fallback possible.
 */
export const client: SanityClient | null = cmsEnabled
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      // Published content only. Drafts are never returned, so an unpublished
      // document simply is not there.
      perspective: "published",
      // The API CDN is deliberately off. Next already caches every query for
      // 60s and the publish webhook purges that cache on demand — layering
      // Sanity's own CDN underneath would keep serving a stale answer after
      // the purge, so a publish or unpublish could take minutes to appear.
      useCdn: false,
    })
  : null;
