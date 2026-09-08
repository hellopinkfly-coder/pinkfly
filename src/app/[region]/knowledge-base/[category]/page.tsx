/**
 * Regional Knowledge Base category —
 * /india/knowledge-base/[category], /dubai/…, /usa/…
 *
 * Thin route wrapper — all rendering lives in the shared page component, so
 * the global site and every regional site run the exact same code.
 */
import { notFound } from "next/navigation";
import { CategoryPage } from "@/components/pages/CategoryPage";
import { isKbCategory } from "@/data/knowledge-base";
import { getRegionContent } from "@/lib/cms/collections";
import { getKnowledgeBaseContent } from "@/lib/cms/content";
import { getRegion, isRegionSlug } from "@/lib/region";
import { buildMetadata } from "@/lib/seo";

/** Rendered on request, so a change published in the Studio is on the page
 *  at the next refresh rather than the next deploy. */
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ region: string; category: string }> };

export async function generateMetadata({ params }: Params) {
  const { region, category } = await params;
  if (!isRegionSlug(region) || !isKbCategory(category)) return {};
  const content = await getKnowledgeBaseContent();
  const meta = content.categories.find((c) => c.id === category);
  return buildMetadata({
    region: await getRegionContent(getRegion(region)),
    path: `/knowledge-base/${category}`,
    title: meta?.title ?? "Knowledge Base",
    description: meta?.intro ?? "",
  });
}

export default async function Page({ params }: Params) {
  const { region, category } = await params;
  if (!isRegionSlug(region) || !isKbCategory(category)) notFound();
  return (
    <CategoryPage
      region={await getRegionContent(getRegion(region))}
      category={category}
    />
  );
}
