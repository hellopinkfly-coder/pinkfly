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

/**
 * Rendered on request, not at build.
 *
 * The page's content comes from Sanity, and a prerendered page keeps whatever
 * the CMS held when the deploy ran — so a change published in the Studio only
 * appeared on the next deploy. Rendering on request means a publish is on the
 * page at the next refresh.
 *
 * Temporary, and paired with `CMS_REVALIDATE_SECONDS = 0`: once the publish
 * webhook is configured, both go back and the site is cached again with the
 * webhook purging it on publish.
 */
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

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
