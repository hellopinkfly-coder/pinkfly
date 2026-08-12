"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { hero } from "@/config/content";
import { heroCarousel } from "@/config/images";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { GradientBackdrop } from "@/components/shared/GradientBackdrop";
import { EASE, fadeUp, staggerContainer } from "@/components/motion/variants";
import { regionPath, type Region } from "@/lib/region";
import { cn } from "@/lib/utils";

/**
 * Homepage hero.
 *
 * The image is a carousel that advances automatically every 1.5s with a soft
 * cross-fade — no slide-in, no motion that competes with the copy. The whole
 * frame links through to the About page, as the wireframe specifies.
 */
export function Hero({ region }: { region: Region }) {
  return (
    <section className="relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-24">
      <GradientBackdrop />
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-start gap-6"
          >
            <motion.span variants={fadeUp} className="pf-eyebrow">
              {region.copy.heroEyebrow}
            </motion.span>

            <motion.h1
              variants={fadeUp}
              className="pf-display max-w-2xl text-[var(--pf-heading)]"
            >
              {region.copy.heroHeadline}
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="max-w-xl text-lg leading-relaxed text-[var(--pf-text)]"
            >
              {region.copy.heroSubhead}
            </motion.p>

            <motion.div variants={fadeUp} className="mt-2 flex flex-wrap gap-3">
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

          <HeroCarousel href={regionPath(region, hero.imageHref)} />
        </div>
      </Container>
    </section>
  );
}

function HeroCarousel({ href }: { href: string }) {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    // Respect reduced-motion by holding on the first frame.
    if (reduceMotion) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % heroCarousel.length),
      hero.interval
    );
    return () => clearInterval(id);
  }, [reduceMotion]);

  const active = heroCarousel[index];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
      className="relative"
    >
      <Link
        href={href}
        aria-label="Read the Pink Fly story"
        className="group block focus-visible:outline-none"
      >
        <div className="pf-shape pf-shape-arch relative aspect-[4/5] w-full border border-[var(--pf-border)] bg-[var(--pf-surface-muted)] shadow-[var(--pf-shadow-lg)] sm:aspect-[5/6] lg:aspect-[4/5]">
          <AnimatePresence mode="sync">
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={active.src}
                alt={active.alt}
                fill
                priority={index === 0}
                sizes="(max-width: 1024px) 92vw, 44vw"
                className="object-cover transition-transform duration-[1.2s] ease-[var(--pf-ease)] group-hover:scale-[1.03]"
              />
            </motion.div>
          </AnimatePresence>

          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-2/5 bg-gradient-to-t from-black/50 to-transparent"
          />

          {/* Corner label — matches the image-card treatment used site-wide. */}
          {active.label && <span className="pf-image-label">{active.label}</span>}

          <span className="absolute left-4 top-4 z-[2] inline-flex items-center gap-1.5 rounded-full bg-white/85 px-3.5 py-1.5 text-xs font-bold text-[var(--pf-accent)] opacity-0 shadow-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:translate-y-1">
            Our story
            <ArrowUpRight size={14} />
          </span>
        </div>
      </Link>

      {/* Progress dots — also let a visitor take manual control. */}
      <div className="mt-5 flex justify-center gap-2">
        {heroCarousel.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Show image ${i + 1}: ${slide.alt}`}
            aria-current={i === index}
            className={cn(
              "h-1.5 rounded-full transition-all duration-500 ease-[var(--pf-ease)]",
              i === index
                ? "w-8 bg-[var(--pf-accent)]"
                : "w-1.5 bg-[var(--pf-border-strong)] hover:bg-[var(--pf-accent)]/50"
            )}
          />
        ))}
      </div>
    </motion.div>
  );
}
