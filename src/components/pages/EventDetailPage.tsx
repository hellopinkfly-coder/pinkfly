import { ArrowUpRight, CalendarDays, Clock, MapPin, Tag } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/shared/Reveal";
import { ImageFrame } from "@/components/shared/ImageFrame";
import { Rail } from "@/components/shared/Rail";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Countdown } from "@/features/events/Countdown";
import { EventCard } from "@/features/events/EventCard";
import { RichText } from "@/components/shared/RichText";
import { upcomingEvents, type PinkflyEvent } from "@/data/events";
import { getEvents } from "@/lib/cms/collections";
import { teamPlaceholder } from "@/config/images";
import {
  formatDuration,
  formatEventDay,
  formatEventTime,
} from "@/lib/date";
import { formatPrice, regionPath, type Region } from "@/lib/region";

/**
 * A single event, following the "Specific event" wireframe:
 * header → time left + image → register now → who should join →
 * why you should join → speaker details → upcoming events → footer.
 */
export async function EventDetailPage({
  event,
  region,
}: {
  event: PinkflyEvent;
  region: Region;
}) {
  const upcoming = upcomingEvents(await getEvents(), region.slug, event.slug);
  const price = formatPrice(region, event.price);
  const registerHref =
    event.registrationUrl || regionPath(region, "/join");

  const facts = [
    { icon: CalendarDays, label: "Date", value: formatEventDay(event.startsAt, region) },
    {
      icon: Clock,
      label: "Time",
      value: `${formatEventTime(event.startsAt, region)} · ${formatDuration(event.durationMinutes)}`,
    },
    {
      icon: MapPin,
      label: "Location",
      value: event.venue ? `${event.venue}, ${event.city}` : `${event.city} — venue to be confirmed`,
    },
    { icon: Tag, label: "Event type", value: `${event.type} · ${event.format}` },
  ];

  return (
    <>
      {/* Time left + hero image */}
      <section className="relative overflow-hidden pt-32 pb-4 sm:pt-40">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <Reveal className="flex flex-col items-start gap-6">
              <div className="flex flex-wrap gap-2">
                <Badge>{event.type}</Badge>
                <Badge variant="neutral">{event.format}</Badge>
                {price && <Badge variant="outline">{price}</Badge>}
              </div>
              <h1 className="pf-h2">{event.title}</h1>
              <p className="max-w-lg text-base leading-relaxed text-[var(--pf-text)] sm:text-lg">
                {event.excerpt}
              </p>
              <Countdown startsAt={event.startsAt} />
            </Reveal>

            <Reveal className="group">
              <ImageFrame
                src={event.image.src}
                alt={event.image.alt}
                label={event.city}
                shape="arch"
                aspect="aspect-[4/5] lg:aspect-[5/6]"
                sizes="(max-width: 1024px) 92vw, 46vw"
                priority
                className="shadow-[var(--pf-shadow-lg)]"
              />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Register + the facts */}
      <Section id="register" className="pt-10">
        <Reveal className="rounded-[var(--pf-radius-2xl)] border border-[var(--pf-border)] bg-[var(--pf-surface)] p-7 shadow-[var(--pf-shadow-sm)] sm:p-9">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <dl className="grid flex-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {facts.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex gap-3">
                  <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--pf-accent-soft)] text-[var(--pf-accent)]">
                    <Icon size={15} />
                  </span>
                  <div>
                    <dt className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[var(--pf-muted)]">
                      {label}
                    </dt>
                    <dd className="mt-0.5 text-sm leading-snug text-[var(--pf-heading)]">
                      {value}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>

            <Button href={registerHref} size="lg" className="shrink-0">
              Register now
              <ArrowUpRight size={18} />
            </Button>
          </div>
        </Reveal>
      </Section>

      {/* Who should join / why you should join */}
      <Section className="bg-[var(--pf-surface)]">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <h2 className="pf-h2 text-2xl sm:text-3xl">
              Who should join this event?
            </h2>
            <ul className="mt-6 flex flex-col gap-3">
              {event.whoShouldJoin.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-base leading-relaxed text-[var(--pf-text)]"
                >
                  <span
                    aria-hidden
                    className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--pf-accent)]"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal>
            <h2 className="pf-h2 text-2xl sm:text-3xl">Why you should join</h2>
            <ul className="mt-6 flex flex-col gap-3">
              {event.whyJoin.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-base leading-relaxed text-[var(--pf-text)]"
                >
                  <span
                    aria-hidden
                    className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--pf-accent)]"
                  />
                  {item}
                </li>
              ))}
            </ul>

            {event.description.length > 0 && (
              <div className="pf-prose mt-8 text-[var(--pf-text)]">
                <RichText value={event.description as never} />
              </div>
            )}
          </Reveal>
        </div>
      </Section>

      {/* Speakers */}
      {event.speakers.length > 0 && (
        <Section id="speakers">
          <Reveal>
            <h2 className="pf-h2 text-2xl sm:text-3xl">Speaker details</h2>
          </Reveal>

          <ul className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {event.speakers.map((speaker, i) => (
              <Reveal
                as="li"
                key={`${speaker.name}-${i}`}
                // Cap the width so a single announced speaker doesn't render
                // as an oversized portrait across an empty row.
                className="group w-full max-w-[280px]"
              >
                <ImageFrame
                  src={speaker.image ?? teamPlaceholder}
                  alt={`${speaker.name}, ${speaker.designation}`}
                  label="Speaker"
                  shape={i % 2 === 0 ? "leaf" : "arch"}
                  aspect="aspect-[4/5]"
                  sizes="(max-width: 640px) 88vw, 30vw"
                  className="shadow-[var(--pf-shadow-md)]"
                />
                <h3 className="mt-5 text-lg">{speaker.name}</h3>
                <p className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--pf-accent)]">
                  {speaker.designation}
                </p>
              </Reveal>
            ))}
          </ul>
        </Section>
      )}

      {/* Upcoming events */}
      {upcoming.length > 0 && (
        <Section className="bg-[var(--pf-surface)]">
          <Reveal>
            <h2 className="pf-h2 text-2xl sm:text-3xl">Upcoming events</h2>
          </Reveal>
          <Rail label="Upcoming events" className="mt-10">
            {upcoming.map((item: PinkflyEvent) => (
              <EventCard
                key={item.slug}
                event={item}
                region={region}
                layout="rail"
              />
            ))}
          </Rail>
        </Section>
      )}
    </>
  );
}
