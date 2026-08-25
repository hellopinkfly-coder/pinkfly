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
      // Published content only, served from the CDN. Draft previews would
      // need a token and `perspective: "previewDrafts"`.
      useCdn: true,
      perspective: "published",
    })
  : null;
