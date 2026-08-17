"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { OinkflyMark } from "./OinkflyMark";
import { DURATION, EASE, liftScale, staggerSlow, lift } from "@/components/motion/variants";
import { cn } from "@/lib/utils";

/* ==========================================================================
   Flight scene
   --------------------------------------------------------------------------
   The site's signature visual: the Oinkfly pig climbing a dashed flight path,
   ringed by the things a founder actually needs. Used in the hero and again
   in the impact section so the two read as one composition, not two blocks.

   It is vector, so it loads instantly, scales to any viewport, and inherits
   the theme — no image request, no layout shift.
   ========================================================================== */

export type OrbitIcon = {
  icon: LucideIcon;
  label: string;
  /** Position as a percentage of the scene box. */
  x: number;
  y: number;
};

type FlightSceneProps = {
  orbit?: OrbitIcon[];
  /** Optional element pinned to the bottom of the scene (e.g. a stat chip). */
  footer?: React.ReactNode;
  className?: string;
};

export function FlightScene({ orbit = [], footer, className }: FlightSceneProps) {
  const still = useReducedMotion();

  return (
    <motion.div
      variants={liftScale}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className={cn("relative isolate", className)}
    >
      {/* --- The scene itself --------------------------------------------- */}
      <div className="pf-on-muted relative aspect-[4/5] overflow-hidden rounded-[var(--pf-radius-2xl)] border border-[var(--pf-border)] bg-gradient-to-br from-[var(--pf-accent-soft)] via-[var(--pf-surface)] to-[var(--pf-surface-muted)] shadow-[var(--pf-shadow-lg)] sm:aspect-[4/4.4]">
        {/* Flight path — draws itself in, once */}
        <svg
          viewBox="0 0 100 110"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          aria-hidden
        >
          <motion.path
            d="M-4 96 C 22 92, 34 66, 52 52 C 70 38, 86 30, 104 26"
            className="pf-flightpath"
            initial={still ? undefined : { pathLength: 0 }}
            whileInView={still ? undefined : { pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease: EASE, delay: 0.3 }}
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* Altitude marks — the horizon the pig is climbing away from */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(to_top,var(--pf-accent-soft),transparent)] opacity-60"
        />

        {/* The pig */}
        <motion.div
          className="absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2"
          animate={still ? undefined : { y: [0, -12, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          <OinkflyMark
            size={190}
            wing={0.55}
            className="w-[42vw] max-w-[190px] text-[var(--pf-accent)] drop-shadow-[0_18px_36px_rgba(216,3,125,0.28)]"
            aria-hidden
          />
        </motion.div>

        {/* Vapour trail */}
        <motion.div
          aria-hidden
          className="absolute left-[8%] top-[68%] h-px w-[34%] origin-left -rotate-[18deg] bg-gradient-to-r from-transparent to-[var(--pf-accent)] opacity-40"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: DURATION.slow, ease: EASE, delay: 0.8 }}
        />

        {footer && (
          <motion.div
            variants={lift}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: DURATION.base, ease: EASE, delay: 0.7 }}
            className="pf-glass absolute inset-x-4 bottom-4 rounded-[var(--pf-radius-lg)] p-4 shadow-[var(--pf-shadow-md)] sm:inset-x-5 sm:bottom-5"
          >
            {footer}
          </motion.div>
        )}
      </div>

      {/* --- Orbiting icons ------------------------------------------------ */}
      {orbit.length > 0 && (
        <motion.ul
          variants={staggerSlow}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          aria-hidden
          className="pointer-events-none absolute inset-x-3 inset-y-0 sm:inset-x-0"
        >
          {orbit.map(({ icon: Icon, label, x, y }, i) => (
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
                className="pf-glass flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[var(--pf-accent)] shadow-[var(--pf-shadow-md)] sm:h-13 sm:w-13"
              >
                <Icon size={19} strokeWidth={1.9} />
              </motion.span>
            </motion.li>
          ))}
        </motion.ul>
      )}
    </motion.div>
  );
}
