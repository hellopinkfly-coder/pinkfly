/**
 * Global policy pages — /policies/terms, /refund, /privacy,
 * /community-guidelines.
 */
import { notFound } from "next/navigation";
import { PolicyPage } from "@/components/pages/PolicyPage";
import { policies, type PolicySlug } from "@/config/policies";
import { getRegionContent } from "@/lib/cms/collections";
import { getRegion } from "@/lib/region";
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

type Params = { params: Promise<{ slug: string }> };

const isPolicySlug = (v: string): v is PolicySlug => v in policies;

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  if (!isPolicySlug(slug)) return {};
  const policy = await getPolicyContent(slug);
  if (!policy) return {};
  return buildMetadata({
    region: await getRegionContent(getRegion()),
    path: `/policies/${slug}`,
    ...policy.seo,
  });
}

export default async function Page({ params }: Params) {
  const { slug } = await params;
  if (!isPolicySlug(slug)) notFound();
  return <PolicyPage slug={slug} region={await getRegionContent(getRegion())} />;
}
