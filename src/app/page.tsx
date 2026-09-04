/**
 * Global homepage (`/`).
 *
 * Regional homepages live at `/india`, `/dubai` and `/usa` and render this
 * same component — see `src/app/[region]/page.tsx`.
 */
import { HomePage } from "@/components/pages/HomePage";
import { getRegionContent } from "@/lib/cms/collections";
import { getRegion } from "@/lib/region";
import { buildHomeMetadata } from "@/lib/seo";
import { getPageSeo } from "@/lib/cms/content";

/**
 * Rendered on request, not at build.
 *
 * The page's content comes from Sanity, and a prerendered page keeps whatever
 * the CMS held when the deploy ran — so a change published in the Studio only
 * appeared on the next deploy. Rendering on request means a publish is on the
 * page at the next refresh.
 *
 * Temporary, and paired with `CMS_REVALIDATE_SECONDS = 0`: once the publish
 * webhook is configured, both go back and the site is cached again with the
 * webhook purging it on publish.
 */
export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const region = await getRegionContent(getRegion());
  return buildHomeMetadata(region, await getPageSeo("home", region.seo));
}

export default async function Page() {
  return <HomePage region={await getRegionContent(getRegion())} />;
}
