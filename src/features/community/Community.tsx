import Link from "next/link";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { ImageFrame } from "@/components/shared/ImageFrame";
import { staggerContainer, fadeUp } from "@/components/motion/variants";
import { regionPath, type Region } from "@/lib/region";
import { cn } from "@/lib/utils";
import type { HomeContent } from "@/lib/cms/content";

/**
 * "How we gather" — four ways the community meets.
 *
 * Real photography rather than infographics, each in a different organic
 * frame, with the alternating vertical offset giving the row an editorial,
 * asymmetric rhythm on wide screens.
 *
 * Each card is one way the community meets, so the whole card — image, title
 * and description — opens the Events page, in the region the visitor is
 * browsing.
 */
export function Community({
  content,
  region,
}: {
  content: HomeContent["community"];
  region: Region;
}) {
  const href = regionPath(region, "/events");
  return (
    <Section id="community" className="bg-[var(--pf-surface)]">
      <SectionHeading
        eyebrow={content.heading.eyebrow}
        title={content.heading.headline}
        intro={content.heading.intro}
      />

      <Reveal
        as="ul"
        variants={staggerContainer}
        className="pf-section-body grid gap-x-8 gap-y-9 sm:gap-y-12 sm:grid-cols-2 lg:grid-cols-4"
      >
        {content.cards.map((card, i) => (
          <Reveal
            as="li"
            key={card.title}
            variants={fadeUp}
            className={cn(
              "group flex flex-col",
              // Staggered baseline — only on the widest layout.
              i % 2 === 1 && "lg:mt-14"
            )}
          >
            <Link
              href={href}
              className="flex flex-col rounded-[var(--pf-radius-xl)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pf-accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--pf-surface)]"
            >
              <ImageFrame
                src={card.image.src}
                alt={card.image.alt}
                label={card.image.label ?? card.title}
                // One silhouette for all four. Each card used to carry its
                // own frame shape — arch, blob, leaf, rectangle — so a row
                // meant to read as four of a kind read as four unrelated
                // things. The rectangle is what every other card on the site
                // uses, so the row now sits in the same family as the rest.
                //
                // Four portraits stacked on a phone made the section roughly
                // three screens long. A square is a third shorter; the
                // portrait returns as soon as the cards sit side by side.
                aspect="aspect-square sm:aspect-[4/5]"
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 23vw"
                className="shadow-[var(--pf-shadow-md)] transition-shadow duration-500 group-hover:shadow-[var(--pf-shadow-lg)]"
              />
              {/* Pink as the resting colour, not just on hover. Before, one card
                  went pink under the cursor and the other three sat in the
                  heading colour, so the row looked like one card was selected
                  rather than four of a kind. Hover now lifts to the brighter
                  pink, which keeps the feedback without the odd-one-out. */}
              <h3 className="mt-4 text-lg text-[var(--pf-accent)] transition-colors duration-300 group-hover:text-[var(--pf-accent-hover)] sm:mt-6">
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--pf-text)]">
                {card.description}
              </p>
            </Link>
          </Reveal>
        ))}
      </Reveal>
    </Section>
  );
}
