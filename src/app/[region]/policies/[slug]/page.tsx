/**
 * Regional policy pages — /[region]/policies/[slug].
 */
import { notFound } from "next/navigation";
import { PolicyPage } from "@/components/pages/PolicyPage";
import { policies, type PolicySlug } from "@/config/policies";
import { getRegionContent } from "@/lib/cms/collections";
import { getRegion, isRegionSlug } from "@/lib/region";
import { regionalSlugs } from "@/config/regions";
import { buildMetadata } from "@/lib/seo";
import { getPolicyContent } from "@/lib/cms/content";

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

type Params = { params: Promise<{ region: string; slug: string }> };

const isPolicySlug = (v: string): v is PolicySlug => v in policies;

export async function generateMetadata({ params }: Params) {
  const { region: regionSlug, slug } = await params;
  if (!isRegionSlug(regionSlug) || !isPolicySlug(slug)) return {};
  const policy = await getPolicyContent(slug);
  if (!policy) return {};
  return buildMetadata({
    region: await getRegionContent(getRegion(regionSlug)),
    path: `/policies/${slug}`,
    ...policy.seo,
  });
}

export default async function Page({ params }: Params) {
  const { region: regionSlug, slug } = await params;
  if (!isRegionSlug(regionSlug)) notFound();
  if (!isPolicySlug(slug)) notFound();
  return <PolicyPage slug={slug} region={await getRegionContent(getRegion(regionSlug))} />;
}
