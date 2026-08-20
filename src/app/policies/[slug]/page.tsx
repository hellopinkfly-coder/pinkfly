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

type Params = { params: Promise<{ slug: string }> };

const isPolicySlug = (v: string): v is PolicySlug => v in policies;

export function generateStaticParams() {
  return Object.keys(policies).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  if (!isPolicySlug(slug)) return {};
  const policy = policies[slug];
  return buildMetadata({
    region: await getRegionContent(getRegion()),
    path: `/policies/${slug}`,
    title: policy.title,
    description: policy.intro,
  });
}

export default async function Page({ params }: Params) {
  const { slug } = await params;
  if (!isPolicySlug(slug)) notFound();
  return <PolicyPage slug={slug} region={await getRegionContent(getRegion())} />;
}
