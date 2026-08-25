/**
 * Global Knowledge Base entry — /knowledge-base/[category]/[slug].
 *
 * Thin route wrapper — the shared page component renders every region.
 */
import { notFound } from "next/navigation";
import { EntryPage } from "@/components/pages/EntryPage";
import { findEntry, isKbCategory } from "@/data/knowledge-base";
import { getKbEntries } from "@/lib/cms/collections";
import { getRegionContent } from "@/lib/cms/collections";
import { getRegion } from "@/lib/region";
import { buildMetadata } from "@/lib/seo";

type Params = { params: Promise<{ category: string; slug: string }> };

// Built from the CMS, so publishing an article prerenders it and
// unpublishing one stops it being built. Falls back to the seed only when
// Sanity is unreachable.
export async function generateStaticParams() {
  return (await getKbEntries()).map(({ category, slug }) => ({ category, slug }));
}

export async function generateMetadata({ params }: Params) {
  const { category, slug } = await params;
  if (!isKbCategory(category)) return {};
  const entry = findEntry(await getKbEntries(), category, slug);
  if (!entry) return {};
  return buildMetadata({
    region: await getRegionContent(getRegion()),
    path: `/knowledge-base/${category}/${slug}`,
    title: entry.title,
    description: entry.excerpt,
    images: [entry.image.src],
  });
}

export default async function Page({ params }: Params) {
  const { category, slug } = await params;
  if (!isKbCategory(category)) notFound();
  const entry = findEntry(await getKbEntries(), category, slug);
  if (!entry) notFound();
  return <EntryPage entry={entry} region={await getRegionContent(getRegion())} />;
}
