/**
 * Regional homepage — `/india`, `/dubai`, `/usa`.
 *
 * Same component as the global homepage; only the region config differs.
 */
import { notFound } from "next/navigation";
import { HomePage } from "@/components/pages/HomePage";
import { getRegionContent } from "@/lib/cms/collections";
import { getRegion, isRegionSlug } from "@/lib/region";
import { regionalSlugs } from "@/config/regions";
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

type Params = { params: Promise<{ region: string }> };

export async function generateMetadata({ params }: Params) {
  const { region: slug } = await params;
  if (!isRegionSlug(slug)) return {};
  const region = await getRegionContent(getRegion(slug));
  return buildHomeMetadata(region, await getPageSeo("home", region.seo));
}

export default async function Page({ params }: Params) {
  const { region: slug } = await params;
  if (!isRegionSlug(slug)) notFound();
  return <HomePage region={await getRegionContent(getRegion(slug))} />;
}
