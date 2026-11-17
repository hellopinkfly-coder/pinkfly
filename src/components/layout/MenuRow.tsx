"use client";

import { useLinkStatus } from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The inside of a row in the phone menu, while the page it points at loads.
 *
 * The press state answers the tap, but it lasts exactly as long as the
 * finger does. What happens next is the problem: the menu only closes once
 * the new page is ready, so between lifting the finger and the page
 * arriving the menu sits there looking untouched — and the obvious read is
 * that the tap missed. People tap again, and the site feels slow rather
 * than busy.
 *
 * So the row says it was heard and stays saying it: it holds a tint of the
 * brand colour, the label moves over a little, and the chevron becomes a
 * spinner, all for exactly as long as the router is working. `pending` is
 * Next's own signal, so a page that is already prefetched — most of them —
 * flashes none of this and simply opens.
 *
 * This has to live inside the `Link` to read that status, which is why the
 * row's contents are their own component.
 */
export function MenuRow({ label }: { label: string }) {
  const { pending } = useLinkStatus();

  return (
    <>
      {/* The tint sits behind the text rather than on the row's own class,
          because the row is the Link and only its children can see the
          pending status. */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 rounded-xl bg-[var(--pf-accent-soft)] transition-opacity duration-150",
          pending ? "opacity-100" : "opacity-0"
        )}
      />
      <span
        className={cn(
          "relative transition-transform duration-200 ease-[var(--pf-ease)] motion-reduce:transition-none",
          pending && "translate-x-1"
        )}
      >
        {label}
      </span>
      {pending ? (
        <span
          aria-hidden
          className="pf-link-spinner relative ml-auto h-4 w-4 shrink-0 rounded-full border-[1.5px] border-[var(--pf-accent)] border-r-transparent"
        />
      ) : (
        <ChevronRight
          aria-hidden
          size={16}
          className="relative ml-auto shrink-0 text-[var(--pf-muted)]"
        />
      )}
      {/* The destination's own heading announces the new page; the wait
          itself is not worth narrating. */}
      <span className="sr-only">{pending ? "Opening" : ""}</span>
    </>
  );
}
