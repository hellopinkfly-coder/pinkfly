/**
 * Regional Knowledge Base entry — /[region]/knowledge-base/[category]/[slug].
 *
 * Thin route wrapper — the shared page component renders every region.
 */
import { notFound } from "next/navigation";
import { EntryPage } from "@/components/pages/EntryPage";
import { getAllEntryPaths, getEntry, isKbCategory } from "@/data/knowledge-base";
import { getRegion, isRegionSlug } from "@/lib/region";
import { regionalSlugs } from "@/config/regions";
import { buildMetadata } from "@/lib/seo";

type Params = { params: Promise<{ region: string; category: string; slug: string }> };

export function generateStaticParams() {
  return regionalSlugs.flatMap((region) =>
    getAllEntryPaths().map((entry) => ({ region, ...entry }))
  );
}

export async function generateMetadata({ params }: Params) {
  const { region: regionSlug, category, slug } = await params;
  if (!isRegionSlug(regionSlug)) return {};
  if (!isKbCategory(category)) return {};
  const entry = getEntry(category, slug);
  if (!entry) return {};
  return buildMetadata({
    region: getRegion(regionSlug),
    path: `/knowledge-base/${category}/${slug}`,
    title: entry.title,
    description: entry.excerpt,
    images: [entry.image.src],
  });
}

export default async function Page({ params }: Params) {
  const { region: regionSlug, category, slug } = await params;
  if (!isRegionSlug(regionSlug)) notFound();
  if (!isKbCategory(category)) notFound();
  const entry = getEntry(category, slug);
  if (!entry) notFound();
  return <EntryPage entry={entry} region={getRegion(regionSlug)} />;
}
