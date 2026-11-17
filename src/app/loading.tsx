import { Container } from "@/components/layout/Container";
import { LogoMark } from "@/components/shared/Logo";
import { siteConfig } from "@/config/site";

/**
 * The loading screen.
 *
 * Next renders this the moment a navigation starts and the page on the way
 * in has not resolved yet. Without it a slow page looks like a dead tap —
 * nothing moves, and on a phone that reads as the site hanging rather than
 * as the site working.
 *
 * A bare spinner would answer that and say nothing. A wait is a few seconds
 * of someone's attention that the site already has, so this spends them
 * saying what Pinkfly is and who it is for: the mark, the promise, and the
 * three things a member actually gets. Someone who arrives on a slow
 * connection learns something before the page they asked for appears.
 *
 * The copy is the site's own `description`, split into its parts rather
 * than written again here, so it cannot drift out of step with the rest of
 * the site. The three cards each fade up a beat after the one before, which
 * is what makes a wait feel like something arriving rather than something
 * stalling.
 *
 * Every animation is suppressed under `prefers-reduced-motion`, where the
 * screen is the same words, held still.
 */

const promises = [
  {
    title: "Mentorship",
    body: "Guidance from founders who have already built it.",
  },
  {
    title: "Network",
    body: "Introductions that open doors, not inboxes.",
  },
  {
    title: "Events",
    body: "Gatherings across India, live and in person.",
  },
];

export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[72vh] items-center py-20"
    >
      <Container>
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <LogoMark size="lg" className="pf-breathe" withTagline />

          <p className="pf-fade-up mt-8 text-balance text-xl leading-snug text-[var(--pf-heading)] sm:text-2xl">
            A community for ambitious women founders.
          </p>

          <p className="pf-fade-up pf-delay-1 mt-3 max-w-md text-balance text-sm leading-relaxed text-[var(--pf-muted)]">
            Everything you need to launch, scale and conquer — gathered in one
            place, with the people who have done it already.
          </p>

          <ul className="mt-10 grid w-full gap-3 sm:grid-cols-3">
            {promises.map((promise, i) => (
              <li
                key={promise.title}
                className={`pf-fade-up pf-delay-${i + 2} rounded-[var(--pf-radius-lg)] border border-[var(--pf-border)] bg-[var(--pf-surface)] px-4 py-5 text-left`}
              >
                <span className="pf-eyebrow text-[var(--pf-accent)]">
                  {promise.title}
                </span>
                <p className="mt-2 text-sm leading-relaxed text-[var(--pf-text)]">
                  {promise.body}
                </p>
              </li>
            ))}
          </ul>

          <span className="pf-loadbar mt-10" aria-hidden />
          <span className="sr-only">Loading {siteConfig.name}</span>
        </div>
      </Container>
    </div>
  );
}
