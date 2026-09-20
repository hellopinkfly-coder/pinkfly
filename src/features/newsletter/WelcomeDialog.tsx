"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CheckCircle2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { newsletterSchema } from "@/lib/validations";
import { parsePathname, regionPath } from "@/lib/region";

/** How long after arriving the dialog appears, in milliseconds. */
const DELAY = 3_000;

/**
 * Remembered per browser, so it asks once and then leaves people alone.
 *
 * Dismissing is remembered for a month; subscribing is remembered for a year,
 * because someone who has already given their address should not be asked for
 * it again on their next visit.
 */
const KEY = "pf-welcome-dialog";
const MONTH = 30 * 24 * 60 * 60 * 1000;
const YEAR = 365 * 24 * 60 * 60 * 1000;

type Status = "idle" | "loading" | "success" | "error";

function suppressedUntil(): number {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? Number(raw) || 0 : 0;
  } catch {
    // Private mode, or storage blocked. Treat it as never asked — which is
    // the friendlier failure: the dialog can be dismissed either way.
    return 0;
  }
}

function suppress(ms: number) {
  try {
    window.localStorage.setItem(KEY, String(Date.now() + ms));
  } catch {
    // Nothing to do. The dialog closes for this visit regardless.
  }
}

/**
 * The newsletter invitation, shown once to a new visitor.
 *
 * It waits three seconds rather than opening on arrival: a dialog that is
 * already there as the page paints reads as an ad and gets closed before it
 * is read, and on a slow connection it can land before the page behind it
 * has drawn at all. Three seconds is long enough that the page is there to
 * come back to, and short enough to catch someone who is only passing.
 *
 * It offers both doors — the newsletter, which costs an email address, and
 * membership, which is the real invitation — because someone not ready to
 * join may still want to hear from us, and someone ready to join should not
 * be handed a newsletter form instead.
 *
 * It never appears on the Join page, where the visitor is already doing the
 * thing it would ask for, nor in the Studio, which renders without the site's
 * chrome at all.
 */
export function WelcomeDialog() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<Element | null>(null);

  const { region, rest } = parsePathname(pathname);
  // Not on Join, where the visitor is already doing what this would ask for.
  const onQuietRoute = rest.startsWith("/join");

  useEffect(() => {
    if (onQuietRoute) return;
    if (Date.now() < suppressedUntil()) return;
    const timer = window.setTimeout(() => setOpen(true), DELAY);
    return () => window.clearTimeout(timer);
  }, [onQuietRoute]);

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
    setOpen(false);
    suppress(MONTH);
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
        // Tagged, so the Studio's subscriber table can show which form
        // actually brings people in.
        body: JSON.stringify({ ...parsed.data, source: "popup" }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setEmail("");
      suppress(YEAR);
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
            className="relative w-full max-w-lg overflow-hidden rounded-[var(--pf-radius-2xl)] border border-[var(--pf-border)] bg-[var(--pf-bg)] p-6 shadow-[var(--pf-shadow-lg)] sm:p-8"
          >
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--pf-muted)] transition-colors hover:bg-[var(--pf-surface-muted)] hover:text-[var(--pf-heading)]"
            >
              <X size={18} />
            </button>

            {status === "success" ? (
              <div className="py-2 text-center">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--pf-accent-soft)] text-[var(--pf-accent)]">
                  <CheckCircle2 size={24} />
                </span>
                <h2
                  id="welcome-dialog-title"
                  className="mt-4 text-xl leading-tight sm:text-2xl"
                >
                  You&apos;re on the list.
                </h2>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-[var(--pf-text)]">
                  The next one lands soon. Membership is the bigger door —
                  mentors, introductions and the rooms behind all this.
                </p>
                <div className="mt-6 flex flex-col items-center gap-3">
                  <Button href={regionPath(region, "/join")} onClick={close}>
                    Join Pinkfly
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
                <span className="pf-eyebrow">Before you go</span>
                <h2
                  id="welcome-dialog-title"
                  className="mt-2 pr-8 text-xl leading-tight sm:text-2xl"
                >
                  Get what founders here are reading.
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[var(--pf-text)] sm:text-base">
                  One email: the new playbooks, the policy changes worth
                  knowing, and the events near you. No pitch, and you can
                  leave any time.
                </p>

                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="mt-5 flex flex-col gap-3 sm:flex-row"
                >
                  <div className="flex-1">
                    <label htmlFor="welcome-email" className="sr-only">
                      Email address
                    </label>
                    <Input
                      id="welcome-email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      aria-invalid={!!error}
                      aria-describedby={error ? "welcome-error" : undefined}
                    />
                  </div>
                  <Button type="submit" disabled={status === "loading"}>
                    {status === "loading" ? "…" : "Subscribe"}
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
                <p className="mt-5 border-t border-[var(--pf-border)] pt-4 text-sm text-[var(--pf-text)]">
                  Ready for the whole thing?{" "}
                  <Link
                    href={regionPath(region, "/join")}
                    onClick={close}
                    className="pf-link font-bold"
                  >
                    Join the community
                  </Link>{" "}
                  <span className="text-[var(--pf-muted)]">
                    — takes about a minute.
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
