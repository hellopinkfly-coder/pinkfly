/**
 * Global event detail page — /events/[slug].
 *
 * Thin route wrapper — the shared page component renders every region.
 */
import { notFound } from "next/navigation";
import { EventDetailPage } from "@/components/pages/EventDetailPage";
import { events, getEvent } from "@/data/events";
import { getRegion } from "@/lib/region";
import { buildMetadata } from "@/lib/seo";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return events.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) return {};
  return buildMetadata({
    region: getRegion(),
    path: `/events/${event.slug}`,
    title: event.title,
    description: event.excerpt,
    images: [event.image.src],
  });
}

export default async function Page({ params }: Params) {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) notFound();
  return <EventDetailPage event={event} region={getRegion()} />;
}
