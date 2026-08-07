"use client";

import { useEffect, useState } from "react";

/**
 * Tracks whether the page is scrolled past a threshold — used to give the
 * navbar its condensed / glass state after the user leaves the hero.
 */
export function useScrolled(threshold = 12): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}
