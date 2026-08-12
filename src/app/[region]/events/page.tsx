/**
 * Regional /events — /india/events, /dubai/events, /usa/events
 *
 * Thin route wrapper — all rendering lives in the shared page component, so
 * the global site and every regional site run the exact same code.
 */
import { notFound } from "next/navigation";
import { EventsPage } from "@/components/pages/EventsPage";
import { getRegion, isRegionSlug } from "@/lib/region";
import { regionalSlugs } from "@/config/regions";
import { buildMetadata } from "@/lib/seo";
import { pageSeo } from "@/config/seo-pages";

type Params = { params: Promise<{ region: string }> };

export function generateStaticParams() {
  return regionalSlugs.map((region) => ({ region }));
}

export async function generateMetadata({ params }: Params) {
  const { region: slug } = await params;
  if (!isRegionSlug(slug)) return {};
  return buildMetadata({
    region: getRegion(slug),
    path: "/events",
    ...pageSeo.events,
  });
}

export default async function Page({ params }: Params) {
  const { region: slug } = await params;
  if (!isRegionSlug(slug)) notFound();
  return <EventsPage region={getRegion(slug)} />;
}
