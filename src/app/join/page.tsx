/**
 * Global /join
 *
 * Thin route wrapper — all rendering lives in the shared page component, so
 * the global site and every regional site run the exact same code.
 */
import { JoinPage } from "@/components/pages/JoinPage";
import { getRegion } from "@/lib/region";
import { buildMetadata } from "@/lib/seo";
import { pageSeo } from "@/config/seo-pages";

const region = getRegion();

export const metadata = buildMetadata({
  region,
  path: "/join",
  ...pageSeo.join,
});

export default function Page() {
  return <JoinPage region={region} />;
}
