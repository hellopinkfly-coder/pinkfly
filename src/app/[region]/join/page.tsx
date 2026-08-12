/**
 * Regional /join — /india/join, /dubai/join, /usa/join
 *
 * Thin route wrapper — all rendering lives in the shared page component, so
 * the global site and every regional site run the exact same code.
 */
import { notFound } from "next/navigation";
import { JoinPage } from "@/components/pages/JoinPage";
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
    path: "/join",
    ...pageSeo.join,
  });
}

export default async function Page({ params }: Params) {
  const { region: slug } = await params;
  if (!isRegionSlug(slug)) notFound();
  return <JoinPage region={getRegion(slug)} />;
}
