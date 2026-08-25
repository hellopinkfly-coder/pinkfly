/**
 * Global event detail page — /events/[slug].
 *
 * Thin route wrapper — the shared page component renders every region.
 */
import { notFound } from "next/navigation";
import { EventDetailPage } from "@/components/pages/EventDetailPage";
import { findEvent } from "@/data/events";
import { getEvents } from "@/lib/cms/collections";
import { getRegionContent } from "@/lib/cms/collections";
import { getRegion } from "@/lib/region";
import { buildMetadata } from "@/lib/seo";

type Params = { params: Promise<{ slug: string }> };

// Built from the CMS so a newly published event is prerendered and an
// unpublished one stops being. `getEvents` falls back to the seed only when
// Sanity is unreachable, which keeps the build working during an outage.
export async function generateStaticParams() {
  return (await getEvents()).map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const event = findEvent(await getEvents(), slug);
  if (!event) return {};
  return buildMetadata({
    region: await getRegionContent(getRegion()),
    path: `/events/${event.slug}`,
    title: event.title,
    description: event.excerpt,
    images: [event.image.src],
  });
}

export default async function Page({ params }: Params) {
  const { slug } = await params;
  const event = findEvent(await getEvents(), slug);
  if (!event) notFound();
  return <EventDetailPage event={event} region={await getRegionContent(getRegion())} />;
}
