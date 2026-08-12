"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { hero } from "@/config/content";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { GradientBackdrop } from "@/components/shared/GradientBackdrop";
import { EASE, fadeUp, staggerContainer } from "@/components/motion/variants";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-20">
      <GradientBackdrop />
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Copy */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-start gap-6"
          >
            <motion.span
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--pf-border)] bg-[var(--pf-surface)] px-4 py-1.5 text-xs font-medium text-[var(--pf-text)]"
            >
              <Sparkles size={14} className="text-[var(--pf-accent)]" />
              {hero.eyebrow}
            </motion.span>

            <motion.h1
              variants={fadeUp}
              className="pf-display max-w-2xl text-[var(--pf-heading)]"
            >
              {hero.headline}
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="max-w-xl text-lg leading-relaxed text-[var(--pf-text)]"
            >
              {hero.subhead}
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              <Button href={hero.primaryCta.href} size="lg">
                {hero.primaryCta.label}
                <ArrowRight size={18} />
              </Button>
              <Button href={hero.secondaryCta.href} variant="secondary" size="lg">
                {hero.secondaryCta.label}
              </Button>
            </motion.div>
          </motion.div>

          {/* Editorial image placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--pf-radius-2xl)] border border-[var(--pf-border)] bg-gradient-to-br from-[var(--pf-accent-soft)] via-[var(--pf-surface)] to-[var(--pf-surface-muted)] shadow-[var(--pf-shadow-lg)]">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="px-8 text-center font-[family-name:var(--font-display)] text-sm uppercase tracking-widest text-[var(--pf-muted)]">
                  Editorial photograph
                  <br />
                  of a woman founder
                </span>
              </div>
              {/* Floating glass stat card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.6 }}
                className="pf-glass absolute bottom-5 left-5 right-5 rounded-[var(--pf-radius-lg)] p-4 shadow-[var(--pf-shadow-md)]"
              >
                <p className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--pf-heading)]">
                  5,000+
                </p>
                <p className="text-xs text-[var(--pf-text)]">
                  women building together
                </p>
              </motion.div>
            </div>

            {/* Caption beneath the visual */}
            <p className="mt-4 text-center text-xs leading-relaxed text-[var(--pf-muted)]">
              {hero.mediaCaption}
            </p>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
