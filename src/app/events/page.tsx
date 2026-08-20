/**
 * Global /events
 *
 * Thin route wrapper — all rendering lives in the shared page component, so
 * the global site and every regional site run the exact same code.
 */
import { EventsPage } from "@/components/pages/EventsPage";
import { getRegionContent } from "@/lib/cms/collections";
import { getRegion } from "@/lib/region";
import { buildMetadata } from "@/lib/seo";
import { pageSeo } from "@/config/seo-pages";
import { getPageSeo } from "@/lib/cms/content";

export async function generateMetadata() {
  return buildMetadata({
    region: await getRegionContent(getRegion()),
    path: "/events",
    ...(await getPageSeo("events", pageSeo.events)),
  });
}

export default async function Page() {
  return <EventsPage region={await getRegionContent(getRegion())} />;
}
