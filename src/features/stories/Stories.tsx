"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { stories } from "@/config/content";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { OinkflyMark } from "@/components/brand/OinkflyMark";
import { DURATION, EASE, slide } from "@/components/motion/variants";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 7000;

export function Stories() {
  const items = stories.items;
  const still = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback(
    (next: number, dir: number) => {
      setDirection(dir);
      setIndex(((next % items.length) + items.length) % items.length);
    },
    [items.length]
  );

  const paginate = useCallback(
    (dir: number) => goTo(index + dir, dir),
    [goTo, index]
  );

  // Autoplay — pauses on hover, focus, and when the tab is hidden.
  useEffect(() => {
    if (paused || still) return;
    const id = window.setInterval(() => {
      if (!document.hidden) setIndex((i) => (i + 1) % items.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused, still, items.length]);

  const active = items[index];

  return (
    <Section id="stories">
      <SectionHeading eyebrow={stories.eyebrow} title={stories.headline} />

      <Reveal className="mx-auto mt-12 max-w-4xl">
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
          className="pf-on-surface relative overflow-hidden rounded-[var(--pf-radius-2xl)] border border-[var(--pf-border)] bg-[var(--pf-surface)] shadow-[var(--pf-shadow-md)]"
        >
          {/* The mark, oversized and faint — the panel and the quote share one
              background so they read as a single composition. */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-8 text-[var(--pf-accent)] opacity-[0.07] sm:-right-4"
          >
            <OinkflyMark size={280} wing={1} />
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(to_top,var(--pf-accent-soft),transparent)] opacity-70"
          />

          <div className="relative p-7 sm:p-12">
            {/* Slides */}
            <div className="min-h-[290px] sm:min-h-[230px]">
              <AnimatePresence mode="wait" custom={direction} initial={false}>
                <motion.blockquote
                  key={index}
                  custom={direction}
                  variants={slide}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: DURATION.base, ease: EASE }}
                  drag={still ? false : "x"}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.12}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -60) paginate(1);
                    else if (info.offset.x > 60) paginate(-1);
                  }}
                  className="cursor-grab active:cursor-grabbing"
                >
                  <p className="max-w-2xl text-xl leading-relaxed text-[var(--pf-heading)] sm:text-2xl">
                    &ldquo;{active.quote}&rdquo;
                  </p>

                  <footer className="mt-8 flex items-center gap-4">
                    <span
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--pf-accent-soft)] font-[family-name:var(--font-display)] text-sm font-bold text-[var(--pf-accent)]"
                      aria-hidden
                    >
                      {active.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                    <div>
                      <p className="font-bold text-[var(--pf-heading)]">{active.name}</p>
                      <p className="text-sm text-[var(--pf-text)]">{active.role}</p>
                    </div>
                  </footer>
                </motion.blockquote>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="mt-8 flex items-center justify-between gap-4">
              <div className="flex gap-2" role="tablist" aria-label="Founder stories">
                {items.map((story, i) => (
                  <button
                    key={story.name}
                    type="button"
                    role="tab"
                    aria-selected={i === index}
                    aria-label={`Story ${i + 1} of ${items.length}: ${story.name}`}
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

              <div className="flex gap-2">
                <CarouselButton label="Previous story" onClick={() => paginate(-1)}>
                  <ArrowLeft size={18} />
                </CarouselButton>
                <CarouselButton label="Next story" onClick={() => paginate(1)}>
                  <ArrowRight size={18} />
                </CarouselButton>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

function CarouselButton({
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
      aria-label={label}
      onClick={onClick}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--pf-border-strong)] bg-[var(--pf-surface)] text-[var(--pf-heading)] transition-all duration-300 ease-[var(--pf-ease)] hover:-translate-y-0.5 hover:border-[var(--pf-accent)] hover:text-[var(--pf-accent)]"
    >
      {children}
    </button>
  );
}
