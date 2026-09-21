"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CheckCircle2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { newsletterSchema } from "@/lib/validations";
import { RisingBalloon } from "./RisingBalloon";
import { parsePathname, regionPath } from "@/lib/region";
import type { SiteContent } from "@/lib/cms/content";

/**
 * Nothing is remembered between visits.
 *
 * Earlier versions kept a date in localStorage — a month after a dismissal,
 * a year after subscribing — and that is exactly what made it look broken:
 * anyone who had ever closed it or subscribed stopped seeing it, and the
 * only way to see it again was a private window. It is shown on every visit,
 * with no exceptions, which is what was asked for.
 *
 * The old key is not read any more, so a browser still carrying one from
 * before is not held back by it.
 */

type Status = "idle" | "loading" | "success" | "error";

/**
 * The newsletter invitation, shown on every visit.
 *
 * It waits three seconds rather than opening on arrival: a dialog that is
 * already there as the page paints reads as an ad and gets closed before it
 * is read, and on a slow connection it can land before the page behind it
 * has drawn at all. Three seconds is long enough that the page is there to
 * come back to, and short enough to catch someone who is only passing.
 *
 * Once per visit, not once per page: the site's chrome stays mounted as a
 * visitor moves between pages, so the timer runs on arrival and not again
 * until they come back. A dialog that reappeared on every click would be
 * unusable.
 *
 * It offers both doors — the newsletter, which costs an email address, and
 * membership, which is the real invitation — because someone not ready to
 * join may still want to hear from us, and someone ready to join should not
 * be handed a newsletter form instead.
 *
 * It never appears on the Join page, where the visitor is already doing the
 * thing it would ask for, nor in the Studio, which renders without the site's
 * chrome at all. Those two are the only exceptions; an editor who wants it
 * gone everywhere turns it off in the Studio.
 */
export function WelcomeDialog({
  content,
}: {
  /** Every line of it, and its timing, edited in the Studio. */
  content: SiteContent["newsletterPopup"];
}) {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<Element | null>(null);

  const { region, rest } = parsePathname(pathname);
  // Not on Join, where the visitor is already doing what this would ask for,
  // and not at all when an editor has switched it off.
  const onQuietRoute = rest.startsWith("/join");
  const delay = Math.max(0, content.delaySeconds) * 1000;

  useEffect(() => {
    if (!content.enabled || onQuietRoute) return;
    const timer = window.setTimeout(() => setOpen(true), delay);
    return () => window.clearTimeout(timer);
  }, [content.enabled, onQuietRoute, delay]);

  // Escape closes it, focus moves into it and back out again, and the page
  // behind it does not scroll while it is open.
  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement;
    closeRef.current?.focus();

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      (previouslyFocused.current as HTMLElement | null)?.focus?.();
    };
    // `close` is stable enough for this: it only reads setters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function close() {
    // Closed for this visit only. Nothing is written, so the next visit
    // asks again.
    setOpen(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = newsletterSchema.safeParse({ email });
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
      setError("Something went wrong. Please try again.");
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[90] flex items-end justify-center bg-black/45 p-4 sm:items-center"
          // Clicking the backdrop dismisses, the same as the close button.
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="welcome-dialog-title"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative max-h-[88svh] w-full max-w-sm overflow-y-auto rounded-[var(--pf-radius-2xl)] border border-[var(--pf-border)] bg-[var(--pf-bg)] p-5 shadow-[var(--pf-shadow-lg)] sm:max-w-md sm:p-7"
          >
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-2 top-2 inline-flex h-11 w-11 items-center justify-center rounded-full text-[var(--pf-muted)] transition-colors hover:bg-[var(--pf-surface-muted)] hover:text-[var(--pf-heading)]"
            >
              <X size={18} />
            </button>

            {status === "success" ? (
              <div className="text-center">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--pf-accent-soft)] text-[var(--pf-accent)]">
                  <CheckCircle2 size={22} />
                </span>
                <h2
                  id="welcome-dialog-title"
                  className="mt-3 text-lg leading-tight sm:text-xl"
                >
                  {content.successTitle}
                </h2>
                <p className="mx-auto mt-2 max-w-[30ch] text-sm leading-snug text-[var(--pf-text)]">
                  {content.successBody}
                </p>
                <div className="mt-5 flex flex-col items-center gap-2">
                  <Button href={regionPath(region, "/join")} onClick={close}>
                    {content.joinLabel}
                    <ArrowRight size={16} />
                  </Button>
                  <button
                    type="button"
                    onClick={close}
                    className="min-h-11 text-sm text-[var(--pf-muted)] transition-colors hover:text-[var(--pf-heading)]"
                  >
                    Maybe later
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* She is the balloon, not a passenger on it — the brand's
                    own image, drifting rather than jumping. */}
                <div className="pointer-events-none flex justify-center">
                  <RisingBalloon size={76} />
                </div>

                <span className="pf-eyebrow block text-center">
                  {content.eyebrow}
                </span>
                <h2
                  id="welcome-dialog-title"
                  className="mt-1.5 text-center text-lg leading-tight sm:text-xl"
                >
                  {content.headline}
                </h2>
                <p className="mx-auto mt-2 max-w-[34ch] text-center text-sm leading-snug text-[var(--pf-text)]">
                  {content.body}
                </p>

                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="mt-4 flex flex-col gap-2 sm:flex-row"
                >
                  <div className="flex-1">
                    <label htmlFor="welcome-email" className="sr-only">
                      Email address
                    </label>
                    <Input
                      id="welcome-email"
                      type="email"
                      autoComplete="email"
                      placeholder={content.placeholder}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      aria-invalid={!!error}
                      aria-describedby={error ? "welcome-error" : undefined}
                    />
                  </div>
                  <Button type="submit" disabled={status === "loading"}>
                    {status === "loading" ? "…" : content.cta}
                    {status !== "loading" && <ArrowRight size={16} />}
                  </Button>
                </form>

                {error && (
                  <p
                    id="welcome-error"
                    role="alert"
                    className="mt-3 text-sm text-[var(--pf-accent-hover)]"
                  >
                    {error}
                  </p>
                )}

                {/* The other door. Someone ready to join should not have to
                    subscribe first to find it. */}
                <p className="mt-4 border-t border-[var(--pf-border)] pt-3 text-center text-sm leading-snug text-[var(--pf-text)]">
                  {content.joinPrompt}{" "}
                  <Link
                    href={regionPath(region, "/join")}
                    onClick={close}
                    className="pf-link font-bold"
                  >
                    {content.joinLabel}
                  </Link>{" "}
                  <span className="text-[var(--pf-muted)]">
                    {content.joinNote}
                  </span>
                </p>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
