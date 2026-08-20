import { EventsHero } from "@/features/events/EventsHero";
import { EventFilters } from "@/features/events/EventFilters";
import { FinalCTA } from "@/features/final-cta/FinalCTA";
import {
  eventCities,
  eventMonths,
  eventTypesForRegion,
  filterEventsForRegion,
} from "@/data/events";
import { getEvents } from "@/lib/cms/collections";
import {
  getEventsPageContent,
  getFinalCta,
  getSiteContent,
} from "@/lib/cms/content";
import type { Region } from "@/lib/region";

/**
 * Events listing: opening visual → filters → results → footer.
 * Filtering happens in place; no navigation, no page reload.
 *
 * The events themselves are Sanity documents, and the page's own copy and
 * banner are edited under Pages → Events.
 */
export async function EventsPage({ region }: { region: Region }) {
  const [all, content, finalCta, site] = await Promise.all([
    getEvents(),
    getEventsPageContent(),
    getFinalCta(),
    getSiteContent(),
  ]);
  const events = filterEventsForRegion(all, region.slug);

  return (
    <>
      <EventsHero region={region} content={content} />
      <EventFilters
        events={events}
        region={region}
        cities={eventCities(all, region.slug)}
        months={eventMonths(all, region.slug)}
        types={eventTypesForRegion(all, region.slug)}
        emptyState={content.emptyState}
      />
      <FinalCTA
        region={region}
        content={finalCta}
        formUrl={region.form.googleFormUrl || site.joinFormUrl}
      />
    </>
  );
}
