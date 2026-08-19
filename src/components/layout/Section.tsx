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
      className={cn("scroll-mt-24 py-10 sm:py-14", className)}
      {...props}
    >
      {bleed ? children : <Container className={containerClassName}>{children}</Container>}
    </section>
  );
}
