/**
 * Global /join
 *
 * Thin route wrapper — all rendering lives in the shared page component, so
 * the global site and every regional site run the exact same code.
 */
import { JoinPage } from "@/components/pages/JoinPage";
import { getRegionContent } from "@/lib/cms/collections";
import { getRegion } from "@/lib/region";
import { buildMetadata } from "@/lib/seo";
import { pageSeo } from "@/config/seo-pages";
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
  return buildMetadata({
    region: await getRegionContent(getRegion()),
    path: "/join",
    ...(await getPageSeo("join", pageSeo.join)),
  });
}

export default async function Page() {
  return <JoinPage region={await getRegionContent(getRegion())} />;
}
