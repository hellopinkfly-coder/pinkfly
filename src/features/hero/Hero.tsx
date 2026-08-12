"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { hero } from "@/config/content";
import { heroSlides, HERO_INTERVAL } from "@/config/images";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { regionPath, type Region } from "@/lib/region";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Full-screen homepage hero carousel.
 *
 * Editorial rather than promotional: one photograph fills the fold, the copy
 * sits over a graded scrim, and each slide carries its own headline so the
 * carousel tells a short story as it advances.
 *
 * Motion is deliberately restrained — a slow cross-fade plus a barely
 * perceptible Ken Burns drift. Nothing slides, bounces or flies in.
 *
 * Behaviour:
 * - cycles continuously, advancing every 2s and wrapping past the last slide
 * - pauses on hover/focus and when the tab is hidden, then resumes
 * - arrow keys and swipe move between slides; the timer restarts from the
 *   chosen slide rather than stopping, so the loop never dies
 * - `prefers-reduced-motion` holds slide one and drops the drift entirely
 */
export function Hero({ region }: { region: Region }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const touchStartX = useRef<number | null>(null);

  const count = heroSlides.length;
  const goTo = useCallback((next: number) => {
    setIndex((next + heroSlides.length) % heroSlides.length);
  }, []);

  const advance = useCallback(() => goTo(index + 1), [goTo, index]);

  // Auto-advance, forever. `advance` changes identity with `index`, so this
  // effect re-runs on every slide change and the timer restarts from the
  // current slide — including after a manual click, swipe or arrow key.
  useEffect(() => {
    if (reduceMotion || paused) return;
    const id = setInterval(advance, HERO_INTERVAL);
    return () => clearInterval(id);
  }, [advance, paused, reduceMotion]);

  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // Arrow-key navigation while the hero has focus within.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    function onKey(e: KeyboardEvent) {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      if (!el?.contains(document.activeElement)) return;
      e.preventDefault();
      goTo(e.key === "ArrowRight" ? index + 1 : index - 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo, index]);

  function select(next: number) {
    goTo(next);
  }

  const slide = heroSlides[index];

  return (
    <section
      ref={rootRef}
      aria-roledescription="carousel"
      aria-label="Pink Fly"
      // Offset by the header's height so the slideshow starts cleanly beneath
      // the navbar instead of running under it, while the fold still ends at
      // the bottom of the viewport.
      className={cn(
        "relative isolate w-full overflow-hidden bg-[#141014]",
        "mt-[100px] h-[calc(100svh-100px)] sm:mt-[110px] sm:h-[calc(100svh-110px)]",
        "min-h-[520px]"
      )}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        const start = touchStartX.current;
        if (start === null) return;
        const delta = e.changedTouches[0].clientX - start;
        if (Math.abs(delta) > 48) select(delta < 0 ? index + 1 : index - 1);
        touchStartX.current = null;
      }}
    >
      {/* Slides */}
      <AnimatePresence initial={false}>
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
          aria-hidden={false}
          role="group"
          aria-roledescription="slide"
          aria-label={`${index + 1} of ${count}`}
        >
          <motion.div
            className="absolute inset-0"
            initial={reduceMotion ? false : { scale: 1.06 }}
            animate={reduceMotion ? undefined : { scale: 1 }}
            transition={{ duration: HERO_INTERVAL / 1000 + 6, ease: "linear" }}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={index === 0}
              sizes="100vw"
              quality={85}
              style={{ objectPosition: slide.focal }}
              className="object-cover"
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Grading: a dark base for legibility, warmed with a whisper of brand
          pink so the fold reads as Pink Fly rather than generic stock. */}
      <span
        aria-hidden
        className="absolute inset-0 z-[1] bg-gradient-to-r from-black/80 via-black/55 to-black/25"
      />
      <span
        aria-hidden
        className="absolute inset-0 z-[1] bg-gradient-to-t from-black/75 via-transparent to-black/40"
      />
      <span
        aria-hidden
        className="absolute inset-0 z-[1] mix-blend-soft-light"
        style={{
          background:
            "radial-gradient(120% 80% at 15% 90%, rgba(216,3,125,0.55), transparent 60%)",
        }}
      />

      {/* Copy */}
      <Container className="relative z-[2] flex h-full max-w-6xl flex-col justify-end pb-28 sm:pb-32 lg:justify-center lg:pb-0">
        <div className="max-w-2xl">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
            className="inline-flex items-center gap-2.5 text-[0.7rem] font-bold uppercase tracking-[0.28em] text-white/85"
          >
            <span aria-hidden className="h-px w-8 bg-[var(--pf-accent)]" />
            {region.copy.heroEyebrow}
          </motion.span>

          {/* Headline and subhead change with the slide. */}
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <h1 className="pf-display mt-6 text-white [text-shadow:0_2px_30px_rgba(0,0,0,0.35)]">
                {index === 0 ? region.copy.heroHeadline : slide.headline}
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
                {index === 0 ? region.copy.heroSubhead : slide.subhead}
              </p>
            </motion.div>
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.35 }}
            className="mt-9 flex flex-wrap gap-3"
          >
            <Button href={regionPath(region, hero.primaryCta.href)} size="lg">
              {hero.primaryCta.label}
              <ArrowRight size={18} />
            </Button>
            <Button
              href={regionPath(region, hero.secondaryCta.href)}
              size="lg"
              className="border border-white/35 bg-white/10 text-white backdrop-blur-md hover:border-white/60 hover:bg-white/20"
            >
              {hero.secondaryCta.label}
            </Button>
          </motion.div>
        </div>
      </Container>

      {/* Controls */}
      <Container className="pointer-events-none absolute inset-x-0 bottom-8 z-[3] max-w-6xl sm:bottom-10">
        <div className="pointer-events-auto flex items-end justify-between gap-6">
          {/* Progress bars — each fills over one interval. */}
          <ul className="flex flex-1 gap-2.5 sm:max-w-sm">
            {heroSlides.map((s, i) => (
              <li key={s.src} className="flex-1">
                <button
                  type="button"
                  onClick={() => select(i)}
                  aria-label={`Go to slide ${i + 1}: ${s.label ?? s.alt}`}
                  aria-current={i === index}
                  className="group relative block h-9 w-full"
                >
                  <span className="absolute inset-x-0 top-4 h-[3px] overflow-hidden rounded-full bg-white/25 transition-colors duration-300 group-hover:bg-white/40">
                    <motion.span
                      className="block h-full rounded-full bg-white"
                      initial={{ width: "0%" }}
                      animate={{ width: i <= index ? "100%" : "0%" }}
                      transition={
                        i === index && !reduceMotion && !paused
                          ? { duration: HERO_INTERVAL / 1000, ease: "linear" }
                          : { duration: 0.3, ease: EASE }
                      }
                    />
                  </span>
                  <span className="sr-only">{s.label}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            {/* Slide caption — the corner label treatment used site-wide.
                Only the caption animates; the counter is static so it never
                flickers as slides change. */}
            <AnimatePresence mode="wait">
              <motion.span
                key={slide.label}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="hidden text-[0.68rem] font-bold uppercase tracking-[0.2em] text-white/75 sm:block"
              >
                {slide.label}
              </motion.span>
            </AnimatePresence>

            <span className="text-[0.68rem] font-bold tabular-nums tracking-[0.16em] text-white/55">
              {String(index + 1).padStart(2, "0")}
              <span className="mx-1 text-white/30">/</span>
              {String(count).padStart(2, "0")}
            </span>

            <div className="flex gap-2">
              <ArrowButton
                direction="left"
                onClick={() => select(index - 1)}
              />
              <ArrowButton
                direction="right"
                onClick={() => select(index + 1)}
              />
            </div>
          </div>
        </div>
      </Container>

      {/* Live region so screen readers hear the slide change. */}
      <span className="sr-only" aria-live="polite">
        Slide {index + 1} of {count}: {slide.label}
      </span>
    </section>
  );
}

function ArrowButton({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: () => void;
}) {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "left" ? "Previous slide" : "Next slide"}
      className={cn(
        "inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md",
        "transition-all duration-300 ease-[var(--pf-ease)] hover:border-white/60 hover:bg-white/20",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
      )}
    >
      <Icon size={18} />
    </button>
  );
}
