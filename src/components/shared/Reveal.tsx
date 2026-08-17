"use client";

import * as React from "react";
import { motion, type Variants } from "framer-motion";
import { lift } from "@/components/motion/variants";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
  /** Delay in seconds before this element animates in. */
  delay?: number;
  as?: "div" | "section" | "ul" | "li";
  style?: React.CSSProperties;
};

/**
 * Scroll-reveal wrapper — the single entry point for "this appears as you
 * scroll to it". Everything on the site enters the same way, at the same
 * speed, travelling the same direction. Reduced motion is respected globally
 * via the CSS guard in globals.css.
 */
export function Reveal({
  children,
  className,
  variants = lift,
  delay = 0,
  as = "div",
  style,
}: RevealProps) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      style={style}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </MotionTag>
  );
}
