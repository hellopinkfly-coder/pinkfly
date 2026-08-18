"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { hero, type HeroSlide } from "@/config/content";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { PinkFlyMark } from "@/components/brand/PinkFlyMark";
import { DURATION, EASE, STAGGER } from "@/components/motion/variants";
import { regionPath, type Region } from "@/lib/region";
import { cn } from "@/lib/utils";

/* ==========================================================================
   Hero banner carousel
   --------------------------------------------------------------------------
   A full-width promotional band: copy on the left, photograph on the right,
   round arrows on either edge. Each slide carries its own headline, two proof
   points, CTA and image, so a slide always reads as one composition rather
   than a caption bolted to a picture.

   Motion stays the house language — everything lifts, one easing curve. The
   copy staggers in behind the image so the eye lands on the photograph first,
   then reads.
   ========================================================================== */

const AUTOPLAY_MS = 6000;

export function HeroCarousel({ region }: { region: Region }) {
  const slides = hero.slides;
  const still = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback(
    (next: number, dir: number) => {
      setDirection(dir);
      setIndex(((next % slides.length) + slides.length) % slides.length);
    },
    [slides.length]
  );

  useEffect(() => {
    if (paused || still || slides.length < 2) return;
    const id = window.setInterval(() => {
      if (!document.hidden) setIndex((i) => (i + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused, still, slides.length]);

  const active = slides[index];

  return (
    <section
      className="pf-on-muted relative isolate overflow-hidden bg-[linear-gradient(110deg,var(--pf-bg)_0%,var(--pf-accent-soft)_55%,var(--pf-surface-muted)_100%)] pt-24 sm:pt-28"
      role="group"
      aria-roledescription="carousel"
      aria-label="Pink Fly"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <GhostWordmark />

      <Container className="relative">
        <div className="min-h-[26rem] sm:min-h-[30rem] lg:min-h-[32rem]">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={index}
              className="grid items-center gap-8 py-10 lg:grid-cols-[1fr_1.05fr] lg:gap-10 lg:py-14"
            >
              {/* ---- Copy ---------------------------------------------- */}
              <motion.div
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: STAGGER, delayChildren: 0.1 } },
                  exit: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
                }}
                className="order-2 flex flex-col items-start gap-5 lg:order-1"
              >
                <Line>
                  <span className="pf-eyebrow">{active.eyebrow}</span>
                </Line>

                <Line>
                  <h1 className="pf-display text-[var(--pf-heading)]">
                    {active.headline}
                  </h1>
                </Line>

                <Line>
                  <p className="max-w-md text-lg leading-relaxed text-[var(--pf-text)]">
                    {active.subhead}
                  </p>
                </Line>

                <Line>
                  <ul className="flex flex-col gap-3">
                    {active.points.map(({ icon: Icon, label }) => (
                      <li
                        key={label}
                        className="flex items-center gap-3 text-[var(--pf-heading)]"
                      >
                        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--pf-surface)] text-[var(--pf-accent)] shadow-[var(--pf-shadow-sm)]">
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

              {/* ---- Image --------------------------------------------- */}
              <motion.div
                custom={direction}
                initial={{ opacity: 0, x: direction >= 0 ? 48 : -48, scale: 1.02 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: direction >= 0 ? -32 : 32 }}
                transition={{ duration: DURATION.slow, ease: EASE }}
                drag={still || slides.length < 2 ? false : "x"}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.12}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60) goTo(index + 1, 1);
                  else if (info.offset.x > 60) goTo(index - 1, -1);
                }}
                className="order-1 lg:order-2"
              >
                <SlideImage
                  image={active.image}
                  priority={index === 0}
                  still={!!still}
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ---- Dots ------------------------------------------------- */}
        {slides.length > 1 && (
          <div
            className="flex justify-center gap-2 pb-8"
            role="tablist"
            aria-label="Slides"
          >
            {slides.map((slide, i) => (
              <button
                key={slide.headline}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={slide.headline}
                onClick={() => goTo(i, i > index ? 1 : -1)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300 ease-[var(--pf-ease)]",
                  i === index
                    ? "w-9 bg-[var(--pf-accent)]"
                    : "w-2 bg-[var(--pf-border-strong)] hover:bg-[var(--pf-accent)]/50"
                )}
              />
            ))}
          </div>
        )}
      </Container>

      {/* ---- Arrows ------------------------------------------------- */}
      {slides.length > 1 && (
        <>
          <Arrow side="left" onClick={() => goTo(index - 1, -1)} />
          <Arrow side="right" onClick={() => goTo(index + 1, 1)} />
        </>
      )}
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

function Arrow({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Previous slide" : "Next slide"}
      className={cn(
        "absolute top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--pf-heading)] text-[var(--pf-bg)] shadow-[var(--pf-shadow-md)] transition-all duration-300 ease-[var(--pf-ease)] hover:bg-[var(--pf-accent)] sm:inline-flex",
        side === "left" ? "left-3 lg:left-5" : "right-3 lg:right-5"
      )}
    >
      <Icon size={20} />
    </button>
  );
}

/**
 * The slide photograph, or the branded panel when no asset has been supplied
 * yet — so a missing image degrades into something still designed, never a
 * broken frame. See public/images/README.md.
 */
function SlideImage({
  image,
  priority,
  still,
}: {
  image: HeroSlide["image"];
  priority: boolean;
  still: boolean;
}) {
  return (
    <div className="relative mx-auto aspect-[16/10] w-full max-w-xl overflow-hidden rounded-[var(--pf-radius-2xl)] border border-[var(--pf-border)] bg-[var(--pf-surface-muted)] shadow-[var(--pf-shadow-lg)]">
      {image.src ? (
        <motion.div
          className="absolute inset-0"
          animate={still ? undefined : { scale: [1, 1.05] }}
          transition={{ duration: 12, ease: "easeInOut" }}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority={priority}
            sizes="(max-width: 1024px) 92vw, 560px"
            className="object-cover"
            draggable={false}
          />
        </motion.div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[var(--pf-accent-soft)] via-[var(--pf-surface)] to-[var(--pf-surface-muted)]">
          <PinkFlyMark
            size={150}
            wing={0.55}
            className="w-[34vw] max-w-[150px] text-[var(--pf-accent)] drop-shadow-[0_18px_36px_rgba(216,3,125,0.28)]"
            aria-hidden
          />
          <span className="sr-only">{image.alt}</span>
        </div>
      )}
    </div>
  );
}

/** Oversized repeating wordmark behind the band. Purely decorative. */
function GhostWordmark() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 flex flex-col justify-center overflow-hidden opacity-[0.05]"
    >
      {[0, 1, 2].map((row) => (
        <span
          key={row}
          className="whitespace-nowrap font-[family-name:var(--font-display)] text-[5.5rem] font-bold leading-[0.95] tracking-tight text-[var(--pf-accent)] sm:text-[8rem]"
          style={{ marginLeft: row % 2 ? "-6rem" : "-2rem" }}
        >
          PINKFLYPINKFLYPINKFLYPINKFLYPINKFLY
        </span>
      ))}
    </div>
  );
}
