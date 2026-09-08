import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/shared/Reveal";
import { EventCard } from "@/features/events/EventCard";
import { upcomingEvents, type PinkflyEvent } from "@/data/events";
import { regionPath, type Region } from "@/lib/region";

/**
 * What is coming up, on the homepage.
 *
 * Three events, the soonest first, for whichever region the visitor is on.
 * "Show all" is the way through to the Events page, where they can be
 * filtered by city, month and type — this section is a taste, not a listing,
 * so it stays short and does not repeat the filters.
 *
 * Nothing scheduled means no section: an empty row of cards says less than
 * the page simply moving on.
 */
export function HomeEvents({
  region,
  events,
}: {
  region: Region;
  events: PinkflyEvent[];
}) {
  const list = upcomingEvents(events, region.slug, undefined, 3);
  if (list.length === 0) return null;

  return (
    <Section id="events" className="border-t border-[var(--pf-border)]">
      <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <span className="pf-eyebrow">What&apos;s on</span>
          <h2 className="pf-h2">Come and meet the room.</h2>
          <p className="max-w-2xl text-base text-[var(--pf-text)]">
            Meetups, masterclasses and coffee chats — the next few, wherever
            you are.
          </p>
        </div>

        <Link
          href={regionPath(region, "/events")}
          className="pf-link inline-flex min-h-11 shrink-0 items-center gap-2 text-sm font-bold"
        >
          Show all events
          <ArrowRight size={15} aria-hidden />
        </Link>
      </Reveal>

      <div className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((event) => (
          <EventCard key={event.slug} event={event} region={region} />
        ))}
      </div>
    </Section>
  );
}
