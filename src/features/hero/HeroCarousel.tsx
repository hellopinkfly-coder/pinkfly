"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { hero, type HeroSlide } from "@/config/content";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { DURATION, EASE, STAGGER } from "@/components/motion/variants";
import { regionPath, type Region } from "@/lib/region";
import { cn } from "@/lib/utils";

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

export function HeroCarousel({ region }: { region: Region }) {
  const slides = hero.slides;
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

  // Touch swipe. The photograph is a background layer, so the gesture is
  // tracked on the section rather than by dragging an element.
  const [swipeStart, setSwipeStart] = useState<number | null>(null);

  return (
    <section
      className="relative isolate flex min-h-[38rem] items-center overflow-hidden bg-[var(--pf-heading)] pt-28 pb-16 sm:min-h-[42rem] sm:pt-32 lg:min-h-[44rem]"
      role="group"
      aria-roledescription="carousel"
      aria-label="Pink Fly"
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
      {/* ---- The photograph, edge to edge ---------------------------- */}
      <AnimatePresence initial={false}>
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DURATION.slow, ease: EASE }}
          className="absolute inset-0 -z-20"
        >
          <SlideMedia slide={active} priority={index === 0} still={!!still} />
        </motion.div>
      </AnimatePresence>

      {/* ---- Blend + legibility -------------------------------------- */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {/* Left-weighted wash: dense under the copy, clear over the subject */}
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(16,10,14,0.93)_0%,rgba(16,10,14,0.86)_42%,rgba(16,10,14,0.7)_72%,rgba(16,10,14,0.55)_100%)] sm:bg-[linear-gradient(100deg,rgba(16,10,14,0.92)_0%,rgba(16,10,14,0.78)_32%,rgba(16,10,14,0.42)_55%,rgba(16,10,14,0.12)_78%,transparent_100%)]" />
        {/* A little brand warmth, so the photograph sits inside the palette */}
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_8%_50%,rgba(216,3,125,0.30)_0%,transparent_62%)] mix-blend-soft-light" />
        {/* Top wash, keeping the floating navbar readable */}
        <div className="absolute inset-x-0 top-0 h-40 bg-[linear-gradient(to_bottom,rgba(16,10,14,0.72),transparent)]" />
        {/* Bottom fade into the page — this is what removes the seam */}
        <div className="absolute inset-x-0 bottom-0 h-36 bg-[linear-gradient(to_top,var(--pf-bg),transparent)] sm:h-48" />
      </div>

      {/* ---- Copy ----------------------------------------------------- */}
      <Container className="relative w-full">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={index}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: STAGGER, delayChildren: 0.1 } },
              exit: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
            }}
            className="flex max-w-xl flex-col items-start gap-5"
          >
            <Line>
              <span className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--pf-accent-hover)] drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)]">
                {active.eyebrow}
              </span>
            </Line>

            <Line>
              <h1 className="pf-display text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.45)]">
                {active.headline}
              </h1>
            </Line>

            <Line>
              <p className="max-w-md text-lg leading-relaxed text-white/85">
                {active.subhead}
              </p>
            </Line>

            <Line>
              <ul className="flex flex-col gap-3">
                {active.points.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-3 text-white">
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/12 text-white backdrop-blur-sm">
                      <Icon size={17} strokeWidth={1.9} aria-hidden />
                    </span>
                    <span className="text-sm sm:text-base">{label}</span>
                  </li>
                ))}
              </ul>
            </Line>

            <Line>
              <Button href={regionPath(region, active.cta.href)} size="lg">
                {active.cta.label}
                <ArrowRight size={18} />
              </Button>
            </Line>
          </motion.div>
        </AnimatePresence>

        {/* ---- Controls: dots left, arrows right ------------------- */}
        {slides.length > 1 && (
          <div className="mt-10 flex items-center justify-between gap-4">
            <div className="flex gap-2" role="tablist" aria-label="Slides">
              {slides.map((slide, i) => (
                <button
                  key={slide.headline}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={slide.headline}
                  onClick={() => goTo(i)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300 ease-[var(--pf-ease)]",
                    i === index ? "w-9 bg-white" : "w-2 bg-white/40 hover:bg-white/70"
                  )}
                />
              ))}
            </div>

            <div className="flex gap-2">
              {/* Explicit pause, so autoplay is stoppable without hovering. */}
              {!still && (
                <RoundButton
                  label={userPaused ? "Play slideshow" : "Pause slideshow"}
                  onClick={() => setUserPaused((v) => !v)}
                >
                  {userPaused ? <Play size={17} /> : <Pause size={17} />}
                </RoundButton>
              )}
              <RoundButton label="Previous slide" onClick={() => goTo(index - 1)}>
                <ChevronLeft size={20} />
              </RoundButton>
              <RoundButton label="Next slide" onClick={() => goTo(index + 1)}>
                <ChevronRight size={20} />
              </RoundButton>
            </div>
          </div>
        )}
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
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition-colors duration-300 ease-[var(--pf-ease)] hover:border-transparent hover:bg-[var(--pf-accent)]"
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
  slide: HeroSlide;
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
      animate={still ? undefined : { scale: [1.04, 1.12] }}
      transition={{ duration: 14, ease: "easeInOut" }}
    >
      <Image
        src={slide.image.src}
        alt={slide.image.alt}
        fill
        priority={priority}
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: slide.image.focal ?? "50% 40%" }}
        draggable={false}
      />
    </motion.div>
  );
}
