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

/**
 * Which way the page last moved, for a header that gets out of the way.
 *
 * A sticky bar is always over whatever is under it, so reading down a phone
 * means a strip of every photograph is behind the header — which is what it
 * looked like on the hero: the picture's top sliced off by an opaque edge.
 *
 * Hiding it while the reader goes down and bringing it back the moment they
 * come up gives the content the whole screen without putting the navigation
 * out of reach: the way back is one short flick, not a journey to the top.
 *
 * Three things keep it from twitching. It stays put within `tolerance` of
 * the last decision, so the small corrections a finger makes mid-scroll do
 * not flip it. It is never hidden within `revealAbove` of the top, where
 * there is nothing to get out of the way of. And it reads the position
 * inside an animation frame rather than on the scroll event, which is also
 * what keeps iOS from reporting a position the page has already left.
 *
 * iOS adds one of its own: a rubber-band scroll past either end reports
 * positions outside the document, and those are clamped away here rather
 * than read as a direction.
 */
export function useHideOnScrollDown(
  revealAbove = 96,
  tolerance = 8
): boolean {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;

    const read = () => {
      frame = 0;
      const max = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const y = Math.min(Math.max(window.scrollY, 0), max);

      if (y <= revealAbove) {
        setHidden(false);
        last = y;
        return;
      }
      if (Math.abs(y - last) < tolerance) return;

      setHidden(y > last);
      last = y;
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(read);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [revealAbove, tolerance]);

  return hidden;
}
