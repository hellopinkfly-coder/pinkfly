import * as React from "react";
import { cn } from "@/lib/utils";
import { Container } from "./Container";

type SectionProps = React.HTMLAttributes<HTMLElement> & {
  /** Optional anchor id for in-page navigation. */
  id?: string;
  /** Render without the inner Container (for full-bleed backgrounds). */
  bleed?: boolean;
  containerClassName?: string;
};

/** Standard section. One vertical rhythm for the whole site. */
/*
 * Section rhythm.
 *
 * 36px of air above and below a section (56px on a laptop) is what made the
 * page feel like a list of blocks rather than a composition: with that
 * little space, the gap between two sections read as smaller than the gaps
 * inside one, so nothing announced where a section ended. The white space
 * between sections now clearly exceeds the space inside them, which is the
 * whole trick — it is what lets each block be read as one thing before the
 * next begins.
 */
export function Section({
  id,
  bleed = false,
  className,
  containerClassName,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn("scroll-mt-20 py-16 sm:scroll-mt-24 sm:py-20 lg:py-28", className)}
      {...props}
    >
      {bleed ? children : <Container className={containerClassName}>{children}</Container>}
    </section>
  );
}
