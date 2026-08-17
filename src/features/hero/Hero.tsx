"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { hero } from "@/config/content";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { GradientBackdrop } from "@/components/shared/GradientBackdrop";
import { HeroCarousel } from "./HeroCarousel";
import { OinkflyMark } from "@/components/brand/OinkflyMark";
import { lift, stagger } from "@/components/motion/variants";
import { regionPath, type Region } from "@/lib/region";

/**
 * The Oinkfly hero: the brand line, one short paragraph, two CTAs, and the
 * founder carousel beside them.
 *
 * Region-aware — CTAs are prefixed so `/india` keeps a visitor in their
 * region rather than dropping them onto the global site.
 */
export function Hero({ region }: { region: Region }) {
  return (
    <section className="relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-24">
      <GradientBackdrop />
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          {/* Copy */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-start gap-6"
          >
            <motion.span
              variants={lift}
              className="pf-on-surface inline-flex items-center gap-2 rounded-full border border-[var(--pf-border)] bg-[var(--pf-surface)] px-4 py-1.5 text-xs text-[var(--pf-text)]"
            >
              <OinkflyMark size={16} className="text-[var(--pf-accent)]" aria-hidden />
              {hero.eyebrow}
            </motion.span>

            <motion.h1
              variants={lift}
              className="pf-display max-w-2xl text-[var(--pf-heading)]"
            >
              {hero.headline}
            </motion.h1>

            <motion.p
              variants={lift}
              className="max-w-lg text-lg leading-relaxed text-[var(--pf-text)]"
            >
              {hero.subhead}
            </motion.p>

            <motion.div variants={lift} className="flex flex-wrap gap-3 sm:gap-4">
              <Button href={regionPath(region, hero.primaryCta.href)} size="lg">
                {hero.primaryCta.label}
                <ArrowRight size={18} />
              </Button>
              <Button
                href={regionPath(region, hero.secondaryCta.href)}
                variant="secondary"
                size="lg"
              >
                {hero.secondaryCta.label}
              </Button>
            </motion.div>
          </motion.div>

          {/* Founders — the people this is actually for */}
          <HeroCarousel className="mx-auto w-full max-w-sm lg:max-w-none" />
        </div>
      </Container>
    </section>
  );
}
