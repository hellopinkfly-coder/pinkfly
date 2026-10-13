"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Container } from "./Container";

/**
 * One way back, in one place, on every page but the homepage.
 *
 * On a phone the site's navigation lives behind the hamburger, so stepping
 * back up meant opening the menu and picking the section again — and the
 * pages that did offer a back link each put it somewhere else, inside their
 * own header. This row sits directly under the bar on every inner page, at
 * the same height, with the same label, so the way out is where it was on the
 * page before. From a desktop the navigation is already on screen and the row
 * is not drawn at all.
 *
 * It goes back through history rather than to a fixed parent, because the
 * page above a Knowledge Base article is whichever list the reader came from.
 * Opened cold — from a shared link, with nothing behind it — it falls back to
 * the region's home page rather than doing nothing.
 */
export function MobileBackRow({ home, onDark }: { home: string; onDark: boolean }) {
  const router = useRouter();

  return (
    <Container className="pb-2 lg:hidden">
      <button
        type="button"
        onClick={() => {
          if (typeof window !== "undefined" && window.history.length > 1) {
            router.back();
            return;
          }
          router.push(home);
        }}
        className={
          "group/back inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-bold transition-colors duration-200 ease-[var(--pf-ease)] " +
          (onDark
            ? "border-white/25 bg-black/30 text-white backdrop-blur-sm hover:border-white/60"
            : "border-[var(--pf-border)] bg-[var(--pf-surface)] text-[var(--pf-text)] hover:border-[var(--pf-accent)] hover:text-[var(--pf-accent)]")
        }
      >
        <ArrowLeft
          size={15}
          aria-hidden
          className="transition-transform duration-200 ease-[var(--pf-ease)] group-hover/back:-translate-x-0.5"
        />
        Back
      </button>
    </Container>
  );
}
