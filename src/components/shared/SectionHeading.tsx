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

/**
 * Consistent eyebrow → headline → intro pattern used across every section.
 *
 * Left is the default, and nearly always the answer. Half the sections took
 * it and half took centre, with no rule behind which was which, so scrolling
 * the homepage moved the heading from the page margin to the middle and back
 * four times. Everything that reads as a page — a heading with content under
 * it — now starts on the same line as the page's own title. Centre is kept
 * for the closing invitation, which is a band rather than a section, and is
 * the one place the symmetry is the point.
 *
 * Centred text is where line breaking shows. Left to itself the browser
 * fills each line to the measure and drops whatever is left onto the last
 * one, which reads as a staircase when every line is centred on a different
 * width. `text-balance` asks the browser to even the lines of the headline
 * instead, and `text-pretty` keeps the paragraph from ending on a single
 * stranded word. Neither changes a word of the copy.
 */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
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
      <h2 className="pf-h2 max-w-3xl text-balance">{title}</h2>
      {intro && (
        <p
          className={cn(
            "max-w-[58ch] text-pretty text-base leading-relaxed text-[var(--pf-text)] sm:text-lg",
            align === "center" && "mx-auto"
          )}
        >
          {intro}
        </p>
      )}
    </Reveal>
  );
}
