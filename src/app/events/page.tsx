/**
 * Global /events
 *
 * Thin route wrapper — all rendering lives in the shared page component, so
 * the global site and every regional site run the exact same code.
 */
import { EventsPage } from "@/components/pages/EventsPage";
import { getRegion } from "@/lib/region";
import { buildMetadata } from "@/lib/seo";
import { pageSeo } from "@/config/seo-pages";

const region = getRegion();

export const metadata = buildMetadata({
  region,
  path: "/events",
  ...pageSeo.events,
});

export default function Page() {
  return <EventsPage region={region} />;
}
