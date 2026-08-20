/**
 * Regional event detail page — /[region]/events/[slug].
 *
 * Thin route wrapper — the shared page component renders every region.
 */
import { notFound } from "next/navigation";
import { EventDetailPage } from "@/components/pages/EventDetailPage";
import { events, findEvent } from "@/data/events";
import { getEvents } from "@/lib/cms/collections";
import { getRegionContent } from "@/lib/cms/collections";
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
  const event = findEvent(await getEvents(), slug);
  if (!event) return {};
  return buildMetadata({
    region: await getRegionContent(getRegion(regionSlug)),
    path: `/events/${event.slug}`,
    title: event.title,
    description: event.excerpt,
    images: [event.image.src],
  });
}

export default async function Page({ params }: Params) {
  const { region: regionSlug, slug } = await params;
  if (!isRegionSlug(regionSlug)) notFound();
  const event = findEvent(await getEvents(), slug);
  if (!event) notFound();
  return <EventDetailPage event={event} region={await getRegionContent(getRegion(regionSlug))} />;
}
