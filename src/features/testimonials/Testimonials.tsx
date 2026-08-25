"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { EASE } from "@/components/motion/variants";
import { cn } from "@/lib/utils";
import type { HomeContent } from "@/lib/cms/content";

/**
 * Founder testimonials.
 *
 * Built and ready, but hidden on the homepage behind `flags.testimonials`
 * until real founder quotes are available. Do not delete.
 */
export function Testimonials({
  content,
}: {
  content: HomeContent["testimonials"];
}) {
  const items = content.items;
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const paginate = (dir: number) => {
    setDirection(dir);
    setIndex((prev) => (prev + dir + items.length) % items.length);
  };

  const active = items[index];

  return (
    <Section id="testimonials">
      <SectionHeading
        eyebrow={content.heading.eyebrow}
        title={content.heading.headline}
      />

      <Reveal className="mx-auto mt-14 max-w-3xl">
        <div className="relative overflow-hidden rounded-[var(--pf-radius-2xl)] border border-[var(--pf-border)] bg-[var(--pf-surface)] p-8 shadow-[var(--pf-shadow-md)] sm:p-12">
          <Quote size={44} className="mb-6 text-[var(--pf-accent-soft)]" aria-hidden />

          <div className="relative min-h-[176px] sm:min-h-[148px]">
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
                <footer className="mt-8">
                  <p className="font-bold text-[var(--pf-heading)]">{active.name}</p>
                  <p className="text-sm text-[var(--pf-text)]">
                    {active.role}, {active.company}
                  </p>
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>

          <div className="mt-10 flex items-center justify-between">
            <div className="flex gap-2">
              {items.map((item, i) => (
                <button
                  key={`${item.quote.slice(0, 12)}-${i}`}
                  type="button"
                  aria-label={`Show testimonial ${i + 1}`}
                  aria-current={i === index}
                  onClick={() => {
                    setDirection(i > index ? 1 : -1);
                    setIndex(i);
                  }}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    i === index
                      ? "w-8 bg-[var(--pf-accent)]"
                      : "w-1.5 bg-[var(--pf-border-strong)] hover:bg-[var(--pf-accent)]/50"
                  )}
                />
              ))}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Previous testimonial"
                onClick={() => paginate(-1)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--pf-border-strong)] text-[var(--pf-heading)] transition-all hover:border-[var(--pf-accent)] hover:text-[var(--pf-accent)]"
              >
                <ArrowLeft size={18} />
              </button>
              <button
                type="button"
                aria-label="Next testimonial"
                onClick={() => paginate(1)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--pf-border-strong)] text-[var(--pf-heading)] transition-all hover:border-[var(--pf-accent)] hover:text-[var(--pf-accent)]"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </Reveal>

      {content.heading.intro && (
        <p className="mt-6 text-center text-xs text-[var(--pf-muted)]">
          {content.heading.intro}
        </p>
      )}
    </Section>
  );
}
