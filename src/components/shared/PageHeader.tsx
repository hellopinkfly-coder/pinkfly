import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/shared/Reveal";
import { GradientBackdrop } from "@/components/shared/GradientBackdrop";
import { ImageFrame } from "@/components/shared/ImageFrame";
import type { StockImage } from "@/config/images";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  intro?: string;
  /** Optional full-bleed banner rendered beneath the copy. */
  banner?: StockImage;
  /**
   * Tighter vertical space.
   *
   * The standard band is sized for a page whose header is the whole first
   * screen. On the Knowledge Base the header is a label above the article
   * rails, and at full height it pushed the first rail below the fold — the
   * page opened on a title and nothing to read.
   */
  compact?: boolean;
  className?: string;
  children?: React.ReactNode;
};

/** Consistent opening band for inner pages. */
export function PageHeader({
  eyebrow,
  title,
  intro,
  banner,
  compact = false,
  className,
  children,
}: PageHeaderProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden",
        // The top padding clears the floating header either way; the compact
        // band just stops giving it a screenful to itself.
        compact ? "pt-28 sm:pt-32" : "pt-32 sm:pt-40",
        banner ? "pb-0" : compact ? "pb-8 sm:pb-10" : "pb-12 sm:pb-16",
        className
      )}
    >
      <GradientBackdrop />
      <Container>
        <Reveal className={cn("flex max-w-3xl flex-col", compact ? "gap-3.5" : "gap-5")}>
          <span className="pf-eyebrow">{eyebrow}</span>
          <h1 className="pf-display text-[var(--pf-heading)]">{title}</h1>
          {intro && (
            <p className="max-w-2xl text-lg leading-relaxed text-[var(--pf-text)]">
              {intro}
            </p>
          )}
          {children}
        </Reveal>

        {banner && (
          <Reveal className="group mt-12">
            <ImageFrame
              src={banner.src}
              alt={banner.alt}
              label={banner.label}
              shape="rect"
              aspect="aspect-[16/9] sm:aspect-[21/9]"
              sizes="(max-width: 1152px) 92vw, 1100px"
              priority
              className="shadow-[var(--pf-shadow-lg)]"
            />
          </Reveal>
        )}
      </Container>
    </section>
  );
}
