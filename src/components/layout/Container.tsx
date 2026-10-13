import * as React from "react";
import { cn } from "@/lib/utils";

/** Centered max-width wrapper with responsive gutters. */
export function Container({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      // The page's side margin, and the one place it is set.
      //
      // It was 20px on a phone, which left the hero's headline, eyebrow pill
      // and control bar sitting against the glass. It is 32px from 360px up
      // — the width of all but the smallest phones — and stays 24px below
      // that, where a wider margin starts costing words off every line of a
      // monospaced face. Everything inherits it, so the logo, the hero and
      // the sections under it all begin on the same line.
      className={cn(
        "mx-auto w-full max-w-6xl px-6 min-[360px]:px-8 lg:px-10",
        className
      )}
      {...props}
    />
  );
}
