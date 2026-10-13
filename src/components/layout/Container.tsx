import * as React from "react";
import { cn } from "@/lib/utils";

/** Centered max-width wrapper with responsive gutters. */
export function Container({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      // The page's side margin, and the one place it is set. 20px on a phone
      // left the headline, the eyebrow pill and the hero's control bar
      // almost against the glass; 24px gives the content an edge to sit
      // against without costing a line of text. It opens up from there with
      // the screen.
      className={cn("mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10", className)}
      {...props}
    />
  );
}
