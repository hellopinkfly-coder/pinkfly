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

type Params = { params: Promise<{ region: string; category: string; slug: string }> };

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
