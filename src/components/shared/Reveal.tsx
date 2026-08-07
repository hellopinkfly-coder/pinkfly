"use client";

import * as React from "react";
import { motion, type Variants } from "framer-motion";
import { fadeUp } from "@/components/motion/variants";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
  /** Delay in seconds before this element animates in. */
  delay?: number;
  /** Render as a stagger parent (children animate in sequence). */
  as?: "div" | "section" | "ul" | "li";
};

/**
 * Scroll-reveal wrapper. Animates once when scrolled into view.
 * Reduced-motion is respected globally via framer-motion + our CSS guard.
 */
export function Reveal({
  children,
  className,
  variants = fadeUp,
  delay = 0,
  as = "div",
}: RevealProps) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
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
