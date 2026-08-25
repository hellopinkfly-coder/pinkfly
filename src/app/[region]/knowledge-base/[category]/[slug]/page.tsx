/**
 * Regional Knowledge Base entry — /[region]/knowledge-base/[category]/[slug].
 *
 * Thin route wrapper — the shared page component renders every region.
 */
import { notFound } from "next/navigation";
import { EntryPage } from "@/components/pages/EntryPage";
import { findEntry, isKbCategory } from "@/data/knowledge-base";
import { getKbEntries } from "@/lib/cms/collections";
import { getRegionContent } from "@/lib/cms/collections";
import { getRegion, isRegionSlug } from "@/lib/region";
import { regionalSlugs } from "@/config/regions";
import { buildMetadata } from "@/lib/seo";

type Params = { params: Promise<{ region: string; category: string; slug: string }> };

// Built from the CMS — see the note on the global route.
export async function generateStaticParams() {
  const published = await getKbEntries();
  return regionalSlugs.flatMap((region) =>
    published.map(({ category, slug }) => ({ region, category, slug }))
  );
}

export async function generateMetadata({ params }: Params) {
  const { region: regionSlug, category, slug } = await params;
  if (!isRegionSlug(regionSlug)) return {};
  if (!isKbCategory(category)) return {};
  const entry = findEntry(await getKbEntries(), category, slug);
  if (!entry) return {};
  return buildMetadata({
    region: await getRegionContent(getRegion(regionSlug)),
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
  const entry = findEntry(await getKbEntries(), category, slug);
  if (!entry) notFound();
  return <EntryPage entry={entry} region={await getRegionContent(getRegion(regionSlug))} />;
}
