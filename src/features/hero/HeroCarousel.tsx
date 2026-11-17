"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { DURATION, EASE, STAGGER } from "@/components/motion/variants";
import { regionPath, type Region } from "@/lib/region";
import { ctaHref } from "@/lib/join-url";
import { cn } from "@/lib/utils";
import type { HeroSlideContent } from "@/lib/cms/content";
import { iconFor } from "@/lib/cms/icons";

/* ==========================================================================
   Hero — full-bleed carousel
   --------------------------------------------------------------------------
   One continuous image. The photograph fills the whole section edge to edge
   and the copy sits directly on it; there is no card, frame, border or radius
   anywhere in here, so there is no seam to see.

   Legibility comes from three stacked gradients rather than a flat overlay:

     1. a left-weighted wash, dense behind the copy and clear over the subject
     2. a soft top wash, so the floating navbar keeps its contrast
     3. a bottom fade into `--pf-bg`, which dissolves the hero into the next
        section instead of ending on a hard horizontal edge

   Motion is unchanged house language: the photograph cross-fades and drifts,
   the copy staggers in behind it.

   Autoplay and manual control both work, and neither cancels the other:
   advancing by arrow, dot or swipe simply restarts the countdown from the
   chosen slide, so the loop never dies.

   Hover does NOT pause it. This hero fills the whole fold, so the cursor
   simply rests on it — pausing there meant the carousel almost never
   advanced. Holds are limited to unambiguous, event-free state: an explicit
   pause button (which also satisfies WCAG 2.2.2), keyboard focus inside the
   carousel, a backgrounded tab, and `prefers-reduced-motion`.
   ========================================================================== */

const AUTOPLAY_MS = 6000;

export function HeroCarousel({
  region,
  slides,
  joinHref,
}: {
  region: Region;
  slides: HeroSlideContent[];
  /** Where a slide's join button leads — the community, where one is set. */
  joinHref: string;
}) {
  const still = useReducedMotion();
  const [index, setIndex] = useState(0);
  // Independent reasons to hold the timer, tracked separately so one
  // clearing does not cancel another.
  const [userPaused, setUserPaused] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const holding = userPaused || focusWithin || !!still;

  const goTo = useCallback(
    (next: number) => {
      setIndex(((next % slides.length) + slides.length) % slides.length);
    },
    [slides.length]
  );

  // Keyed on `index`: every manual move restarts the countdown from the slide
  // the visitor chose, rather than stopping the loop or advancing early.
  useEffect(() => {
    if (holding || slides.length < 2) return;
    const id = window.setInterval(() => {
      // A backgrounded tab holds without tearing the timer down, so the loop
      // resumes on its own when the visitor comes back.
      if (!document.hidden) setIndex((i) => (i + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [index, holding, slides.length]);

  const active = slides[index];

  // Touch swipe. The gesture is tracked on the section rather than by
  // dragging an element, so it works over the picture and the copy alike.
  const [swipeStart, setSwipeStart] = useState<number | null>(null);

  // A slide whose picture carries its own words: nothing is written beside
  // it, and the banner takes the full width.
  const bannerSlide = active.imageHasText;

  return (
    <section
      className="relative isolate overflow-hidden bg-[var(--pf-bg)] pb-10 pt-6 sm:pb-16 sm:pt-10"
      role="group"
      aria-roledescription="carousel"
      aria-label="Pinkfly"
      // Hold for KEYBOARD focus only. A mouse click on a control also focuses
      // it, and treating that as a hold left autoplay stopped for good after
      // the first click — `:focus-visible` is exactly the distinction.
      onFocusCapture={(e) => {
        const el = e.target as HTMLElement;
        if (typeof el.matches === "function" && el.matches(":focus-visible")) {
          setFocusWithin(true);
        }
      }}
      onBlurCapture={() => setFocusWithin(false)}
      onTouchStart={(e) => setSwipeStart(e.touches[0]?.clientX ?? null)}
      onTouchEnd={(e) => {
        if (swipeStart === null) return;
        const dx = (e.changedTouches[0]?.clientX ?? swipeStart) - swipeStart;
        if (Math.abs(dx) > 50) goTo(index + (dx < 0 ? 1 : -1));
        setSwipeStart(null);
      }}
    >
      {/* ---- The photograph, in a frame of its own --------------------
          It used to lie behind the words, which is why this section has been
          argued about for weeks: text on a photograph always needs a wash,
          and a wash is a dark slab across the top of a page that is
          otherwise light. Lighten it and the words lose their footing;
          darken it and the picture is grey and the slab is worse.

          Beside the words, neither problem exists. The copy sits on the
          page's own surface at full contrast in both themes, and the
          photograph is shown whole, undimmed, at its own proportions. */}
      <Container
        className={cn(
          // One row with two cells that share it, rather than one column
          // pinned over the other. `lg:absolute … lg:w-1/2` for the picture
          // and a second centred Container for the words could not agree
          // where the middle of the page was — a Container centres itself —
          // so on a desktop window the copy sat mid-screen and ran
          // underneath the photograph. Shared cells cannot overlap.
          // No gap between the cells, because the gap is what stopped the
          // split falling on the middle of the screen: two equal columns
          // with a gap between them put the picture's edge half a gap to
          // the right of centre. Without it each cell is exactly half, the
          // picture starts on the centre line, and the breathing room
          // between words and photograph is the copy's own right padding.
          !bannerSlide && "lg:grid lg:grid-cols-2 lg:items-stretch lg:gap-0"
        )}
      >
        <div
          className={cn(
            "mb-7",
            // The words belong in the page's 72rem column; the picture does
            // not. Boxed in the same column it reads as a thumbnail with a
            // corridor of page colour beside it, so from `lg` up it leaves
            // the container and runs to the edge of the window.
            bannerSlide ? "pf-bleed-x" : "pf-bleed-r lg:order-2 lg:mb-0"
          )}
        >
          <div
            className={cn(
              "relative overflow-hidden rounded-[var(--pf-radius-2xl)] bg-[var(--pf-surface-muted)]",
              bannerSlide
                ? "aspect-[5/4] sm:aspect-[16/9] lg:aspect-[21/9] lg:rounded-none"
                : // `h-full` and an aspect ratio cannot both decide the box:
                  // the ratio wins and sets the width from the stretched
                  // height, which pushed the picture past the window edge.
                  // In the two-column layout the cell's shape is the shape.
                  "aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto lg:h-full lg:rounded-none lg:rounded-l-[var(--pf-radius-2xl)]"
            )}
          >
          <AnimatePresence initial={false}>
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              // Linear rather than the house easing: an eased cross-fade dips
              // in the middle, because both layers are part-transparent at
              // once and the background shows between them. Held linear, one
              // photograph simply becomes the other.
              transition={{ duration: 1.1, ease: "linear" }}
              className="absolute inset-0"
            >
              <SlideMedia slide={active} priority={index === 0} still={!!still} />
            </motion.div>
          </AnimatePresence>
          </div>
        </div>

      {/* ---- Copy ----------------------------------------------------- */}
      {/* One grid cell, shared. With `mode="wait"` the outgoing slide had to
          finish leaving before the next arrived, so for a moment the
          container held nothing: the section dropped to its min-height and
          sprang back. That is the jump that reads as the hero "not being
          fixed" — worst on a phone, where the copy is tallest and each slide
          is a different height. Stacked, the section is always as tall as
          its tallest live slide and never moves. */}
      <div
        className={cn(
          "relative grid w-full grid-cols-1 grid-rows-1",
          !bannerSlide && "lg:order-1 lg:min-h-[28rem] lg:content-center lg:pr-14"
        )}
      >
        <AnimatePresence initial={false}>
          <motion.div
            key={index}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={{
              // The whole block fades as one, under the incoming slide.
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  opacity: { duration: 0.45, ease: "linear" },
                  staggerChildren: STAGGER,
                  delayChildren: 0.1,
                },
              },
              exit: {
                opacity: 0,
                transition: {
                  opacity: { duration: 0.45, ease: "linear" },
                  staggerChildren: 0.04,
                  staggerDirection: -1,
                },
              },
            }}
            // Both slides sit in the same cell; the one on its way out must
            // not catch a tap meant for the one arriving.
            style={{ gridArea: "1 / 1" }}
            className="pointer-events-auto flex max-w-xl flex-col items-start gap-4 self-center sm:gap-5"
          >
            {/* A banner already says all of this inside the picture. The
                headline still exists for the page — a document needs one, and
                a search engine reads it — but it is not drawn twice. */}
            {bannerSlide ? (
              <h1 className="sr-only">{active.headline}</h1>
            ) : (
              <>
                <Line>
                  <span className="pf-eyebrow pf-eyebrow--pill">
                    {active.eyebrow}
                  </span>
                </Line>

                <Line>
                  <h1 className="pf-display pf-display--hero text-balance text-[var(--pf-heading)]">
                    {active.headline}
                  </h1>
                </Line>
              </>
            )}

            {!bannerSlide && (
              <Line>
                <p className="max-w-[34ch] text-pretty text-base leading-relaxed text-[var(--pf-text)] sm:max-w-md sm:text-lg">
                  {active.subhead}
                </p>
              </Line>
            )}

            {!bannerSlide && (
              <Line>
              <ul className="flex flex-col gap-2 sm:gap-3">
                {active.points.map(({ icon, label }) => {
                  const Icon = iconFor(icon);
                  return (
                    <li
                      key={label}
                      className="flex items-center gap-3 text-[var(--pf-text)]"
                    >
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--pf-accent-soft)] text-[var(--pf-accent)] sm:h-9 sm:w-9">
                        <Icon size={17} strokeWidth={1.9} aria-hidden />
                      </span>
                      <span className="text-sm leading-snug sm:text-base">{label}</span>
                    </li>
                  );
                })}
              </ul>
              </Line>
            )}

            <Line>
              {/* The label is long enough to overrun a 320px screen, and the
                  button is nowrap by default. Below `sm` it steps down a size
                  and is allowed to wrap rather than being clipped. */}
              <Button
                href={ctaHref(active.cta.href, joinHref, region)}
                size="lg"
                className="h-auto min-h-11 whitespace-normal px-5 py-2.5 text-left text-sm leading-snug sm:min-h-13 sm:whitespace-nowrap sm:px-8 sm:py-3.5 sm:text-base"
              >
                {active.cta.label}
                <ArrowRight size={18} className="shrink-0" />
              </Button>
            </Line>
          </motion.div>
        </AnimatePresence>

        {/* ---- Controls -------------------------------------------------
            One bar, not five floating parts.

            The dots sat against the far left of the container and the three
            buttons against the far right, a page apart, each button its own
            translucent circle at 10% white. Over the pale lower half of a
            photograph — which is also where the section's bottom fade lifts
            everything towards the page colour — they had almost no edge left
            and read as smudges rather than controls.

            They are one cluster now: dots, a hairline divider, then the
            buttons, inside a single dark glass pill sitting under the copy it
            belongs to. The pill is its own contrast, so it holds up over a
            light photograph or a dark one, and the group reads as a control
            rather than as marks left on the image.
            --------------------------------------------------------------- */}
        {slides.length > 1 && (
          <div className="mt-5 flex sm:mt-9">
            <div className="inline-flex items-center rounded-full border border-[var(--pf-border)] bg-[var(--pf-surface)] p-1 shadow-[var(--pf-shadow-sm)]">
              <div className="flex px-1" role="tablist" aria-label="Slides">
                {slides.map((slide, i) => (
                  <button
                    key={slide.headline}
                    type="button"
                    role="tab"
                    aria-selected={i === index}
                    aria-label={slide.headline}
                    onClick={() => goTo(i)}
                    // The dot is the mark; the button around it is the target,
                    // sized for a thumb rather than for the mark's height.
                    className="group/dot inline-flex h-9 items-center justify-center px-1 sm:h-11 sm:px-1.5"
                  >
                    <span
                      className={cn(
                        "block h-1.5 rounded-full transition-all duration-300 ease-[var(--pf-ease)]",
                        i === index
                          ? "w-6 bg-[var(--pf-accent)]"
                          : "w-2 bg-[var(--pf-border-strong)] group-hover/dot:bg-[var(--pf-accent)]/60"
                      )}
                    />
                  </button>
                ))}
              </div>

              <span aria-hidden className="mx-0.5 h-4 w-px shrink-0 bg-[var(--pf-border)] sm:mx-1 sm:h-5" />

              <div className="flex gap-0.5">
                {/* Explicit pause, so autoplay is stoppable without hovering. */}
                {!still && (
                  <RoundButton
                    label={userPaused ? "Play slideshow" : "Pause slideshow"}
                    onClick={() => setUserPaused((v) => !v)}
                  >
                    {userPaused ? <Play size={15} /> : <Pause size={15} />}
                  </RoundButton>
                )}
                <RoundButton label="Previous slide" onClick={() => goTo(index - 1)}>
                  <ChevronLeft size={17} />
                </RoundButton>
                <RoundButton label="Next slide" onClick={() => goTo(index + 1)}>
                  <ChevronRight size={17} />
                </RoundButton>
              </div>
            </div>
          </div>
        )}
      </div>
      </Container>

    </section>
  );
}

/** One staggered line of hero copy. */
function Line({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE } },
        exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: EASE } },
      }}
    >
      {children}
    </motion.div>
  );
}

function RoundButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      // No surface of its own: the bar around it already provides one, and
      // a circle inside a pill inside a photograph is two borders too many.
      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--pf-text)] transition-colors duration-200 ease-[var(--pf-ease)] hover:bg-[var(--pf-surface-muted)] hover:text-[var(--pf-accent)] sm:h-11 sm:w-11"
    >
      {children}
    </button>
  );
}

/**
 * The photograph, filling the section. When no asset has been supplied the
 * slide falls back to a brand gradient with the mark — still full-bleed, so
 * the composition never collapses into an empty box.
 * See public/images/README.md.
 */
function SlideMedia({
  slide,
  priority,
  still,
}: {
  slide: HeroSlideContent;
  priority: boolean;
  still: boolean;
}) {
  if (!slide.image.src) {
    return (
      <div className="absolute inset-0 bg-[linear-gradient(120deg,var(--pf-heading)_0%,#3a1230_55%,var(--pf-accent)_140%)]">
        <span className="sr-only">{slide.image.alt}</span>
      </div>
    );
  }

  return (
    <motion.div
      className="absolute inset-0"
      // Gentler than it was (1.04 → 1.12). `object-cover` already crops a
      // 3:2 photograph hard to fill a tall, narrow phone, so the subject is
      // enlarged before any drift is added; the old range pushed it further
      // and the whole hero read as zoomed in. A slower, shallower move keeps
      // the life without the magnification.
      // A banner is a designed thing: its words are part of the artwork, so
      // drifting it also drifts them out of the frame. Only photographs get
      // the slow push.
      animate={still || slide.imageHasText ? undefined : { scale: [1.0, 1.05] }}
      transition={{ duration: 20, ease: "easeInOut" }}
    >
      <Image
        src={slide.image.src}
        alt={slide.image.alt}
        fill
        priority={priority}
        // Half the window from `lg` up, which is the width actually
        // needed there; asking for a full-width file wasted most of it.
        sizes="(min-width: 1024px) 50vw, 100vw"
        // `cover` crops to fill, which is right for a photograph and wrong
        // for a banner: on a phone a wide banner lost its own words off both
        // sides. A banner is shown whole against the box's own colour.
        className={slide.imageHasText ? "object-contain" : "object-cover"}
        style={
          slide.imageHasText
            ? undefined
            : { objectPosition: slide.image.focal ?? "50% 40%" }
        }
        draggable={false}
      />
    </motion.div>
  );
}
