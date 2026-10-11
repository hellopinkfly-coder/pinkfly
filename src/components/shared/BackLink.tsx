import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * "Back to wherever you came from", as one component.
 *
 * The Knowledge Base had two of these written separately — a pink bold link
 * on a category page, a grey muted one on an article — and none at all on the
 * index, so the deepest page in the site had a way out and the page above it
 * did not. Two spellings of the same idea is how a site stops feeling made by
 * one hand.
 *
 * It is a bordered chip rather than a bare text link: over a page that opens
 * on a banner, an underlined word floating above the heading is easy to miss,
 * and a target you can see is a target you can hit. The arrow slides on hover
 * — the only motion, because the control is small and anything more reads as
 * fidgeting.
 */
export function BackLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group/back inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--pf-border)]",
        "bg-[var(--pf-surface)] px-4 text-sm font-bold text-[var(--pf-text)]",
        "transition-colors duration-200 ease-[var(--pf-ease)]",
        "hover:border-[var(--pf-accent)] hover:text-[var(--pf-accent)]",
        className
      )}
    >
      <ArrowLeft
        size={15}
        aria-hidden
        className="transition-transform duration-200 ease-[var(--pf-ease)] group-hover/back:-translate-x-0.5"
      />
      {children}
    </Link>
  );
}
