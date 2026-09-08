/**
 * Global Knowledge Base category — /knowledge-base/[category].
 *
 * Thin route wrapper — the shared page component renders every region.
 */
import { notFound } from "next/navigation";
import { CategoryPage } from "@/components/pages/CategoryPage";
import { isKbCategory } from "@/data/knowledge-base";
import { getRegionContent } from "@/lib/cms/collections";
import { getKnowledgeBaseContent } from "@/lib/cms/content";
import { getRegion } from "@/lib/region";
import { buildMetadata } from "@/lib/seo";

/** Rendered on request, so a change published in the Studio is on the page
 *  at the next refresh rather than the next deploy. */
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Params) {
  const { category } = await params;
  if (!isKbCategory(category)) return {};
  const content = await getKnowledgeBaseContent();
  const meta = content.categories.find((c) => c.id === category);
  return buildMetadata({
    region: await getRegionContent(getRegion()),
    path: `/knowledge-base/${category}`,
    title: meta?.title ?? "Knowledge Base",
    description: meta?.intro ?? "",
  });
}

export default async function Page({ params }: Params) {
  const { category } = await params;
  if (!isKbCategory(category)) notFound();
  return <CategoryPage region={await getRegionContent(getRegion())} category={category} />;
}
