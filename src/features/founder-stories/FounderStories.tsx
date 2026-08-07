"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { founderStories } from "@/config/content";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { EASE } from "@/components/motion/variants";
import { cn } from "@/lib/utils";

export function FounderStories() {
  const stories = founderStories.stories;
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const paginate = (dir: number) => {
    setDirection(dir);
    setIndex((prev) => (prev + dir + stories.length) % stories.length);
  };

  const active = stories[index];

  return (
    <Section id="stories">
      <SectionHeading
        eyebrow={founderStories.eyebrow}
        title={founderStories.headline}
      />

      <Reveal className="mx-auto mt-14 max-w-3xl">
        <div className="relative overflow-hidden rounded-[var(--pf-radius-2xl)] border border-[var(--pf-border)] bg-[var(--pf-surface)] p-8 shadow-[var(--pf-shadow-md)] sm:p-12">
          <Quote
            size={48}
            className="mb-6 text-[var(--pf-accent-soft)]"
            aria-hidden
          />

          <div className="relative min-h-[168px] sm:min-h-[140px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.blockquote
                key={index}
                custom={direction}
                initial={{ opacity: 0, x: direction >= 0 ? 40 : -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction >= 0 ? -40 : 40 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <p className="text-xl leading-relaxed text-[var(--pf-heading)] sm:text-2xl">
                  &ldquo;{active.quote}&rdquo;
                </p>
                <footer className="mt-8 flex items-center gap-4">
                  {/* Founder photo placeholder */}
                  <span
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--pf-accent-soft)] to-[var(--pf-surface-muted)] font-[family-name:var(--font-display)] text-sm font-bold text-[var(--pf-accent)]"
                    aria-hidden
                  >
                    {active.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                  <div>
                    <p className="font-medium text-[var(--pf-heading)]">
                      {active.name}
                    </p>
                    <p className="text-sm text-[var(--pf-text)]">
                      {active.role}, {active.company}
                    </p>
                  </div>
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="mt-10 flex items-center justify-between">
            <div className="flex gap-2" role="tablist" aria-label="Founder stories">
              {stories.map((story, i) => (
                <button
                  key={story.name}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Story ${i + 1}: ${story.name}`}
                  onClick={() => {
                    setDirection(i > index ? 1 : -1);
                    setIndex(i);
                  }}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    i === index
                      ? "w-8 bg-[var(--pf-accent)]"
                      : "w-2 bg-[var(--pf-border-strong)] hover:bg-[var(--pf-accent)]/50"
                  )}
                />
              ))}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Previous story"
                onClick={() => paginate(-1)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--pf-border-strong)] text-[var(--pf-heading)] transition-all hover:border-[var(--pf-accent)] hover:text-[var(--pf-accent)]"
              >
                <ArrowLeft size={18} />
              </button>
              <button
                type="button"
                aria-label="Next story"
                onClick={() => paginate(1)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--pf-border-strong)] text-[var(--pf-heading)] transition-all hover:border-[var(--pf-accent)] hover:text-[var(--pf-accent)]"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </Reveal>

      <p className="mt-8 text-center text-xs text-[var(--pf-muted)]">
        {founderStories.subhead}
      </p>
    </Section>
  );
}
