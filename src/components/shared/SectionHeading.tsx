import * as React from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  className?: string;
};

/** Consistent eyebrow → headline → intro pattern used across every section. */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {eyebrow && <span className="pf-eyebrow">{eyebrow}</span>}
      <h2 className="pf-h2 max-w-3xl">{title}</h2>
      {intro && (
        <p
          className={cn(
            "max-w-2xl text-base leading-relaxed text-[var(--pf-text)] sm:text-lg",
            align === "center" && "mx-auto"
          )}
        >
          {intro}
        </p>
      )}
    </Reveal>
  );
}
