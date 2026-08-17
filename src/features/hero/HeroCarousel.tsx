"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { hero, type HeroSlide } from "@/config/content";
import { OinkflyMark } from "@/components/brand/OinkflyMark";
import {
  DURATION,
  EASE,
  lift,
  liftScale,
  staggerSlow,
} from "@/components/motion/variants";
import { cn } from "@/lib/utils";

/* ==========================================================================
   Hero carousel
   --------------------------------------------------------------------------
   Portraits of the women who actually use Oinkfly. The photograph, the
   caption and the orbiting icons sit inside one frame and animate as one
   composition — the caption rises with the image, it does not pop in after.

   Motion is the same language as the rest of the site: slide along the
   reading axis, fade, settle. The only addition is a very slow scale on the
   active photo, which keeps a still image feeling alive without drawing
   attention to itself.
   ========================================================================== */

const AUTOPLAY_MS = 5500;

export function HeroCarousel({ className }: { className?: string }) {
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
  // A photograph needs a dark scrim to stay legible; the branded fallback is
  // already light, so it keeps the page's own type colours instead of going
  // grey under an overlay it doesn't need.
  const hasPhoto = Boolean(active.src);

  return (
    <motion.div
      variants={liftScale}
      initial="hidden"
      animate="visible"
      className={cn("relative isolate", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div
        className="pf-on-muted relative aspect-[4/5] overflow-hidden rounded-[var(--pf-radius-2xl)] border border-[var(--pf-border)] bg-[var(--pf-surface-muted)] shadow-[var(--pf-shadow-lg)]"
        role="group"
        aria-roledescription="carousel"
        aria-label="Oinkfly founders"
      >
        <AnimatePresence mode="popLayout" custom={direction} initial={false}>
          <motion.figure
            key={index}
            custom={direction}
            initial={{ opacity: 0, x: direction >= 0 ? 40 : -40, scale: 1.04 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: direction >= 0 ? -28 : 28, scale: 1.02 }}
            transition={{ duration: DURATION.slow, ease: EASE }}
            drag={still || slides.length < 2 ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) goTo(index + 1, 1);
              else if (info.offset.x > 60) goTo(index - 1, -1);
            }}
            className="absolute inset-0 m-0 cursor-grab active:cursor-grabbing"
          >
            <SlideMedia slide={active} priority={index === 0} still={!!still} />

            {/* Legibility scrim — only where there is a photograph to darken */}
            {hasPhoto && (
              <div
                aria-hidden
                className="absolute inset-0 bg-[linear-gradient(to_top,rgba(20,17,15,0.82)_0%,rgba(20,17,15,0.28)_38%,transparent_62%)]"
              />
            )}

            {/* Caption — part of the slide, so it travels with the photo */}
            <figcaption className="absolute inset-x-5 bottom-5">
              <p
                className={cn(
                  "font-[family-name:var(--font-display)] text-lg font-bold leading-tight",
                  hasPhoto ? "text-white" : "text-[var(--pf-heading)]"
                )}
              >
                {active.name}
              </p>
              <p
                className={cn(
                  "mt-1 text-sm",
                  hasPhoto ? "text-white/80" : "text-[var(--pf-text)]"
                )}
              >
                {active.role}
              </p>
              <p
                className={cn(
                  "mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs backdrop-blur-md",
                  hasPhoto
                    ? "bg-white/15 text-white/90"
                    : "bg-[var(--pf-surface)]/70 text-[var(--pf-text)]"
                )}
              >
                <OinkflyMark
                  size={14}
                  wing={0.7}
                  className={hasPhoto ? "text-white" : "text-[var(--pf-accent)]"}
                  style={{ ["--pf-knockout" as string]: "transparent" }}
                  aria-hidden
                />
                {active.city}
              </p>
            </figcaption>
          </motion.figure>
        </AnimatePresence>

        {/* Progress dots */}
        {slides.length > 1 && (
          <div
            className="absolute inset-x-5 top-5 flex gap-1.5"
            role="tablist"
            aria-label="Founders"
          >
            {slides.map((slide, i) => (
              <button
                key={slide.name}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`${slide.name}, ${slide.role}`}
                onClick={() => goTo(i, i > index ? 1 : -1)}
                className={cn(
                  "h-1 flex-1 overflow-hidden rounded-full transition-colors duration-300",
                  hasPhoto ? "bg-white/30" : "bg-[var(--pf-border-strong)]"
                )}
              >
                <span
                  className={cn(
                    "block h-full rounded-full transition-transform duration-500 ease-[var(--pf-ease)]",
                    hasPhoto ? "bg-white" : "bg-[var(--pf-accent)]",
                    i === index ? "scale-x-100" : "scale-x-0"
                  )}
                  style={{ transformOrigin: "left" }}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Orbiting icons — the support that surrounds every founder here */}
      <motion.ul
        variants={staggerSlow}
        initial="hidden"
        animate="visible"
        aria-hidden
        className="pointer-events-none absolute inset-x-3 inset-y-0 sm:inset-x-0"
      >
        {hero.orbit.map(({ icon: Icon, label, x, y }, i) => (
          <motion.li
            key={label}
            variants={lift}
            className="absolute"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <motion.span
              title={label}
              animate={still ? undefined : { y: [0, -9, 0] }}
              transition={{
                duration: 5.5 + (i % 3),
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.45,
              }}
              className="pf-glass flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[var(--pf-accent)] shadow-[var(--pf-shadow-md)]"
            >
              <Icon size={19} strokeWidth={1.9} />
            </motion.span>
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  );
}

/* -------------------------------------------------------------- Media -- */

/**
 * Renders the photograph when one has been supplied, and a branded portrait
 * treatment when it hasn't — so a missing asset degrades into something that
 * still looks designed, never a broken image or an empty grey box.
 * See public/images/founders/README.md for how to add the photographs.
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
  if (slide.src) {
    return (
      <motion.div
        className="absolute inset-0"
        animate={still ? undefined : { scale: [1, 1.06] }}
        transition={{ duration: 14, ease: "easeInOut" }}
      >
        <Image
          src={slide.src}
          alt={slide.alt}
          fill
          priority={priority}
          sizes="(max-width: 1024px) 90vw, 460px"
          className="object-cover"
          draggable={false}
        />
      </motion.div>
    );
  }

  return (
    <div className="absolute inset-0 bg-gradient-to-br from-[var(--pf-accent-soft)] via-[var(--pf-surface)] to-[var(--pf-surface-muted)]">
      <svg viewBox="0 0 100 110" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
        <path
          d="M-4 92 C 22 88, 34 62, 52 48 C 70 34, 86 26, 104 22"
          className="pf-flightpath"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2">
        <OinkflyMark
          size={170}
          wing={0.55}
          className="w-[38vw] max-w-[170px] text-[var(--pf-accent)] drop-shadow-[0_18px_36px_rgba(216,3,125,0.28)]"
          aria-hidden
        />
      </div>
      <span className="sr-only">{slide.alt}</span>
    </div>
  );
}
