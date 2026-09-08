import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/shared/Reveal";
import { Rail } from "@/components/shared/Rail";
import { ArticleCard } from "./ArticleCard";
import type { KbEntry } from "@/data/knowledge-base";
import { regionPath, type Region } from "@/lib/region";
import { cn } from "@/lib/utils";

type CategoryRailProps = {
  id: string;
  /** The category's own slug, for the "Show all" destination. */
  category: string;
  title: string;
  intro: string;
  entries: KbEntry[];
  region: Region;
  /** Alternating surface so the three categories read as separate bands. */
  muted?: boolean;
};

/**
 * One Knowledge Base category rendered as a smooth horizontal rail. The card
 * widths are set so at least three are visible above the fold on a desktop
 * viewport, while mobile scrolls one-and-a-bit cards at a time.
 */
export function CategoryRail({
  id,
  category,
  title,
  intro,
  entries,
  region,
  muted = false,
}: CategoryRailProps) {
  if (entries.length === 0) return null;

  return (
    <Section
      id={id}
      className={cn(
        "border-t border-[var(--pf-border)]",
        muted && "bg-[var(--pf-surface)]"
      )}
    >
      <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="pf-h2">{title}</h2>
          <p className="max-w-2xl text-base text-[var(--pf-text)]">{intro}</p>
        </div>

        {/* The rail shows a handful; this is where the rest of them live. */}
        <Link
          href={regionPath(region, `/knowledge-base/${category}`)}
          className="pf-link inline-flex min-h-11 shrink-0 items-center gap-2 text-sm font-bold"
        >
          Show all
          <ArrowRight size={15} aria-hidden />
        </Link>
      </Reveal>

      <Rail label={title} className="mt-10">
        {entries.map((entry) => (
          <ArticleCard key={entry.slug} entry={entry} region={region} />
        ))}
      </Rail>
    </Section>
  );
}
