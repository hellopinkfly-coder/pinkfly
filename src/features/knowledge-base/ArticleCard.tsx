import Link from "next/link";
import { Clock } from "lucide-react";
import { ImageFrame } from "@/components/shared/ImageFrame";
import type { KbEntry } from "@/data/knowledge-base";
import { regionPath, type Region } from "@/lib/region";
import { cn } from "@/lib/utils";

type ArticleCardProps = {
  entry: KbEntry;
  region: Region;
  /** `rail` is the fixed-width card used inside a horizontal scroller. */
  layout?: "rail" | "grid";
  className?: string;
};

/**
 * The single card used by every Knowledge Base category, so Recent Articles,
 * Business News and Government Policies share one visual system. The whole
 * card is a link; the image carries a category chip in its bottom-right
 * corner and the metadata line carries reading time and author.
 */
export function ArticleCard({
  entry,
  region,
  layout = "rail",
  className,
}: ArticleCardProps) {
  const href = regionPath(
    region,
    `/knowledge-base/${entry.category}/${entry.slug}`
  );

  return (
    <article
      className={cn(
        "group",
        layout === "rail" && "w-[276px] sm:w-[320px] lg:w-[340px]",
        className
      )}
    >
      <Link
        href={href}
        className="flex h-full flex-col rounded-[var(--pf-radius-xl)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pf-accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--pf-bg)]"
      >
        <ImageFrame
          src={entry.image.src}
          alt={entry.image.alt}
          label={entry.tag}
          shape="rect"
          aspect="aspect-[4/3]"
          sizes="(max-width: 640px) 78vw, 340px"
          className="shadow-[var(--pf-shadow-sm)] transition-shadow duration-500 group-hover:shadow-[var(--pf-shadow-md)]"
        />

        <div className="flex flex-1 flex-col pt-5">
          <h3 className="text-lg leading-snug transition-colors duration-300 group-hover:text-[var(--pf-accent)]">
            {entry.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--pf-text)]">
            {entry.excerpt}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--pf-muted)]">
            <span className="inline-flex items-center gap-1.5">
              <Clock size={13} aria-hidden />
              {entry.readingTime}
            </span>
            <span aria-hidden>·</span>
            <span>{entry.author.name}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
