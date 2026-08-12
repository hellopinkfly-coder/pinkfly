/**
 * Regional privacy policy — /india/privacy, /dubai/privacy, /usa/privacy.
 */
import { notFound } from "next/navigation";
import { PrivacyPage } from "@/components/pages/PrivacyPage";
import { getRegion, isRegionSlug } from "@/lib/region";
import { regionalSlugs } from "@/config/regions";
import { buildMetadata } from "@/lib/seo";
import { pageSeo } from "@/config/seo-pages";

type Params = { params: Promise<{ region: string }> };

export function generateStaticParams() {
  return regionalSlugs.map((region) => ({ region }));
}

export async function generateMetadata({ params }: Params) {
  const { region: slug } = await params;
  if (!isRegionSlug(slug)) return {};
  return buildMetadata({
    region: getRegion(slug),
    path: "/privacy",
    ...pageSeo.privacy,
  });
}

export default async function Page({ params }: Params) {
  const { region: slug } = await params;
  if (!isRegionSlug(slug)) notFound();
  return <PrivacyPage region={getRegion(slug)} />;
}
