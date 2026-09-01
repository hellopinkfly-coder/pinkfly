import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import { ImageFrame } from "@/components/shared/ImageFrame";
import { Badge } from "@/components/ui/badge";
import type { PinkflyEvent } from "@/data/events";
import { formatEventDate } from "@/lib/date";
import { formatPrice, regionPath, type Region } from "@/lib/region";
import { cn } from "@/lib/utils";

type EventCardProps = {
  event: PinkflyEvent;
  region: Region;
  layout?: "grid" | "rail";
  className?: string;
};

/**
 * Event card — image, type, date, location, and a details/register pair.
 *
 * The whole card opens the event. The title link carries an absolutely
 * positioned pseudo-element that covers the card, so a click anywhere on it
 * lands on the event page while the markup stays a single anchor per
 * destination; the Register link sits above that overlay so it keeps its own
 * target. Nothing about the card's appearance changes.
 */
export function EventCard({
  event,
  region,
  layout = "grid",
  className,
}: EventCardProps) {
  const href = regionPath(region, `/events/${event.slug}`);
  const price = formatPrice(region, event.price);

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[var(--pf-radius-xl)] border border-[var(--pf-border)] bg-[var(--pf-surface)] shadow-[var(--pf-shadow-sm)] transition-all duration-300 ease-[var(--pf-ease)] hover:-translate-y-1 hover:border-[var(--pf-accent)]/30 hover:shadow-[var(--pf-shadow-md)]",
        layout === "rail" && "w-[280px] shrink-0 sm:w-[320px]",
        className
      )}
    >
      <ImageFrame
        src={event.image.src}
        alt={event.image.alt}
        label={event.type}
        shape="rect"
        aspect="aspect-[16/10]"
        sizes="(max-width: 640px) 88vw, 340px"
        className="rounded-none"
      />

      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="neutral">{event.format}</Badge>
          {price && <Badge variant="outline">{price}</Badge>}
        </div>

        <h3 className="mt-4 text-lg leading-snug transition-colors duration-300 group-hover:text-[var(--pf-accent)]">
          <Link
            href={href}
            className="after:absolute after:inset-0 after:rounded-[var(--pf-radius-xl)] after:content-[''] focus-visible:outline-none"
          >
            {event.title}
          </Link>
        </h3>

        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--pf-text)]">
          {event.excerpt}
        </p>

        <ul className="mt-4 flex flex-col gap-1.5 text-xs text-[var(--pf-muted)]">
          <li className="flex items-center gap-2">
            <CalendarDays size={13} aria-hidden />
            {formatEventDate(event.startsAt, region)}
          </li>
          <li className="flex items-center gap-2">
            <MapPin size={13} aria-hidden />
            {event.venue ? `${event.venue}, ${event.city}` : event.city}
          </li>
        </ul>

        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[var(--pf-border)] pt-5 text-sm">
          <Link
            href={href}
            className="relative z-10 font-bold text-[var(--pf-heading)] transition-colors hover:text-[var(--pf-accent)]"
          >
            Details
          </Link>
          <Link href={`${href}#register`} className="pf-link relative z-10 font-bold">
            Register
          </Link>
        </div>
      </div>
    </article>
  );
}
