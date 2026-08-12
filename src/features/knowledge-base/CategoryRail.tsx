import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/shared/Reveal";
import { Rail } from "@/components/shared/Rail";
import { ArticleCard } from "./ArticleCard";
import type { KbEntry } from "@/data/knowledge-base";
import type { Region } from "@/lib/region";
import { cn } from "@/lib/utils";

type CategoryRailProps = {
  id: string;
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
      <Reveal className="flex flex-col gap-2">
        <h2 className="pf-h2">{title}</h2>
        <p className="max-w-2xl text-base text-[var(--pf-text)]">{intro}</p>
      </Reveal>

      <Rail label={title} className="mt-10">
        {entries.map((entry) => (
          <ArticleCard key={entry.slug} entry={entry} region={region} />
        ))}
      </Rail>
    </Section>
  );
}
