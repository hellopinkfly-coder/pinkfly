/**
 * Regional event detail page — /[region]/events/[slug].
 *
 * Thin route wrapper — the shared page component renders every region.
 */
import { notFound } from "next/navigation";
import { EventDetailPage } from "@/components/pages/EventDetailPage";
import { events, getEvent } from "@/data/events";
import { getRegion, isRegionSlug } from "@/lib/region";
import { regionalSlugs } from "@/config/regions";
import { buildMetadata } from "@/lib/seo";

type Params = { params: Promise<{ region: string; slug: string }> };

export function generateStaticParams() {
  return regionalSlugs.flatMap((region) =>
    events
      .filter((event) => event.regions.includes(region))
      .map((event) => ({ region, slug: event.slug }))
  );
}

export async function generateMetadata({ params }: Params) {
  const { region: regionSlug, slug } = await params;
  if (!isRegionSlug(regionSlug)) return {};
  const event = getEvent(slug);
  if (!event) return {};
  return buildMetadata({
    region: getRegion(regionSlug),
    path: `/events/${event.slug}`,
    title: event.title,
    description: event.excerpt,
    images: [event.image.src],
  });
}

export default async function Page({ params }: Params) {
  const { region: regionSlug, slug } = await params;
  if (!isRegionSlug(regionSlug)) notFound();
  const event = getEvent(slug);
  if (!event) notFound();
  return <EventDetailPage event={event} region={getRegion(regionSlug)} />;
}
