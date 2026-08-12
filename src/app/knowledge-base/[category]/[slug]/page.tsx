/**
 * Global Knowledge Base entry — /knowledge-base/[category]/[slug].
 *
 * Thin route wrapper — the shared page component renders every region.
 */
import { notFound } from "next/navigation";
import { EntryPage } from "@/components/pages/EntryPage";
import { getAllEntryPaths, getEntry, isKbCategory } from "@/data/knowledge-base";
import { getRegion } from "@/lib/region";
import { buildMetadata } from "@/lib/seo";

type Params = { params: Promise<{ category: string; slug: string }> };

export function generateStaticParams() {
  return getAllEntryPaths();
}

export async function generateMetadata({ params }: Params) {
  const { category, slug } = await params;
  if (!isKbCategory(category)) return {};
  const entry = getEntry(category, slug);
  if (!entry) return {};
  return buildMetadata({
    region: getRegion(),
    path: `/knowledge-base/${category}/${slug}`,
    title: entry.title,
    description: entry.excerpt,
    images: [entry.image.src],
  });
}

export default async function Page({ params }: Params) {
  const { category, slug } = await params;
  if (!isKbCategory(category)) notFound();
  const entry = getEntry(category, slug);
  if (!entry) notFound();
  return <EntryPage entry={entry} region={getRegion()} />;
}
