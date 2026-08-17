import { EventsHero } from "@/features/events/EventsHero";
import { EventFilters } from "@/features/events/EventFilters";
import { FinalCTA } from "@/features/final-cta/FinalCTA";
import {
  getEventCities,
  getEventMonths,
  getEventTypesForRegion,
  getEventsForRegion,
} from "@/data/events";
import type { Region } from "@/lib/region";

/**
 * Events listing: opening visual → filters → results → footer.
 * Filtering happens in place; no navigation, no page reload.
 */
export function EventsPage({ region }: { region: Region }) {
  const events = getEventsForRegion(region.slug);

  return (
    <>
      <EventsHero region={region} />
      <EventFilters
        events={events}
        region={region}
        cities={getEventCities(region.slug)}
        months={getEventMonths(region.slug)}
        types={getEventTypesForRegion(region.slug)}
      />
      <FinalCTA region={region} />
    </>
  );
}
