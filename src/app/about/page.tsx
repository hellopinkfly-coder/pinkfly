/**
 * Global /about
 *
 * Thin route wrapper — all rendering lives in the shared page component, so
 * the global site and every regional site run the exact same code.
 */
import { AboutPage } from "@/components/pages/AboutPage";
import { getRegion } from "@/lib/region";
import { buildMetadata } from "@/lib/seo";
import { pageSeo } from "@/config/seo-pages";

const region = getRegion();

export const metadata = buildMetadata({
  region,
  path: "/about",
  ...pageSeo.about,
});

export default function Page() {
  return <AboutPage region={region} />;
}
