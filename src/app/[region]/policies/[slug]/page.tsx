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

type Params = { params: Promise<{ region: string; slug: string }> };

const isPolicySlug = (v: string): v is PolicySlug => v in policies;

export function generateStaticParams() {
  return regionalSlugs.flatMap((region) =>
    Object.keys(policies).map((slug) => ({ region, slug }))
  );
}

export async function generateMetadata({ params }: Params) {
  const { region: regionSlug, slug } = await params;
  if (!isRegionSlug(regionSlug) || !isPolicySlug(slug)) return {};
  const policy = policies[slug];
  return buildMetadata({
    region: await getRegionContent(getRegion(regionSlug)),
    path: `/policies/${slug}`,
    title: policy.title,
    description: policy.intro,
  });
}

export default async function Page({ params }: Params) {
  const { region: regionSlug, slug } = await params;
  if (!isRegionSlug(regionSlug)) notFound();
  if (!isPolicySlug(slug)) notFound();
  return <PolicyPage slug={slug} region={await getRegionContent(getRegion(regionSlug))} />;
}
