/**
 * Global /knowledge-base
 *
 * Thin route wrapper — all rendering lives in the shared page component, so
 * the global site and every regional site run the exact same code.
 */
import { KnowledgeBasePage } from "@/components/pages/KnowledgeBasePage";
import { getRegionContent } from "@/lib/cms/collections";
import { getRegion } from "@/lib/region";
import { buildMetadata } from "@/lib/seo";
import { pageSeo } from "@/config/seo-pages";
import { getPageSeo } from "@/lib/cms/content";

export async function generateMetadata() {
  return buildMetadata({
    region: await getRegionContent(getRegion()),
    path: "/knowledge-base",
    ...(await getPageSeo("knowledgeBase", pageSeo.knowledgeBase)),
  });
}

export default async function Page() {
  return <KnowledgeBasePage region={await getRegionContent(getRegion())} />;
}
