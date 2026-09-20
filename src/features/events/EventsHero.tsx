import Image from "next/image";
import { Container } from "@/components/layout/Container";
import type { Region } from "@/lib/region";
import type { EventsPageContent } from "@/lib/cms/content";

/**
 * Events opening visual.
 *
 * The page opens directly on this full-bleed image, with the title set over
 * it. The site's own header floats above it, transparent with light type
 * until the visitor scrolls off the image. It used to be a stripped bar with
 * no navigation at all, which left this page as the one place with no links
 * to the rest of the site.
 */
export function EventsHero({
  region,
  content,
}: {
  region: Region;
  content: EventsPageContent;
}) {
  return (
    <section className="relative isolate min-h-[62vh] w-full overflow-hidden sm:min-h-[70vh]">
      <Image
        src={content.banner.src}
        alt={content.banner.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <span
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/35"
      />

      <Container className="relative flex min-h-[62vh] flex-col justify-end pb-14 pt-36 sm:min-h-[70vh] sm:pb-20">
        <span className="text-xs font-bold uppercase tracking-[0.22em] text-white/85">
          {content.eyebrow}
        </span>
        <h1 className="pf-display mt-4 max-w-3xl text-white">
          {content.title}
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
          {region.copy.eventsIntro}
        </p>
      </Container>
    </section>
  );
}
