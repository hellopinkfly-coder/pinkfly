/**
 * Global /knowledge-base
 *
 * Thin route wrapper — all rendering lives in the shared page component, so
 * the global site and every regional site run the exact same code.
 */
import { KnowledgeBasePage } from "@/components/pages/KnowledgeBasePage";
import { getRegion } from "@/lib/region";
import { buildMetadata } from "@/lib/seo";
import { pageSeo } from "@/config/seo-pages";

const region = getRegion();

export const metadata = buildMetadata({
  region,
  path: "/knowledge-base",
  ...pageSeo.knowledgeBase,
});

export default function Page() {
  return <KnowledgeBasePage region={region} />;
}
