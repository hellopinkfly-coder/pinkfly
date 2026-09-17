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
  /**
   * Draw the card tighter.
   *
   * The homepage shows three events as a taste of the Events page, above a
   * Knowledge Base section and a closing CTA, so the cards there are the
   * middle of a long page rather than its subject. The Events page keeps the
   * roomier card: there the cards *are* the page.
   */
  compact?: boolean;
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
  compact = false,
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
        aspect={compact ? "aspect-[16/9]" : "aspect-[16/10]"}
        sizes="(max-width: 640px) 88vw, 340px"
        className="rounded-none"
      />

      <div className={cn("flex flex-1 flex-col", compact ? "p-5" : "p-6")}>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="neutral">{event.format}</Badge>
          {price && <Badge variant="outline">{price}</Badge>}
        </div>

        <h3
          className={cn(
            "leading-snug transition-colors duration-300 group-hover:text-[var(--pf-accent)]",
            compact ? "mt-3 text-base" : "mt-4 text-lg"
          )}
        >
          <Link
            href={href}
            className="after:absolute after:inset-0 after:rounded-[var(--pf-radius-xl)] after:content-[''] focus-visible:outline-none"
          >
            {event.title}
          </Link>
        </h3>

        <p
          className={cn(
            "mt-2 line-clamp-2 text-sm text-[var(--pf-text)]",
            compact ? "leading-snug" : "leading-relaxed"
          )}
        >
          {event.excerpt}
        </p>

        <ul
          className={cn(
            "flex flex-col text-xs text-[var(--pf-muted)]",
            compact ? "mt-3 gap-1" : "mt-4 gap-1.5"
          )}
        >
          <li className="flex items-center gap-2">
            <CalendarDays size={13} aria-hidden />
            {formatEventDate(event.startsAt, region)}
          </li>
          <li className="flex items-center gap-2">
            <MapPin size={13} aria-hidden />
            {event.venue ? `${event.venue}, ${event.city}` : event.city}
          </li>
        </ul>

        {/* Both links carry a full tap height on a phone — a bare line of
            text is too small a target for a thumb. */}
        <div
          className={cn(
            "flex flex-wrap items-center gap-x-5 border-t border-[var(--pf-border)] text-sm",
            compact ? "mt-4 pt-2 sm:pt-3" : "mt-5 pt-3 sm:mt-6 sm:pt-5"
          )}
        >
          <Link
            href={href}
            className="relative z-10 inline-flex min-h-11 items-center font-bold text-[var(--pf-heading)] transition-colors hover:text-[var(--pf-accent)] sm:min-h-0"
          >
            Details
          </Link>
          <Link
            href={`${href}#register`}
            className="pf-link relative z-10 inline-flex min-h-11 items-center font-bold sm:min-h-0"
          >
            Register
          </Link>
        </div>
      </div>
    </article>
  );
}
