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

type Params = { params: Promise<{ region: string }> };

export function generateStaticParams() {
  return regionalSlugs.map((region) => ({ region }));
}

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
