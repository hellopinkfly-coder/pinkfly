import { trust } from "@/config/content";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/shared/Reveal";

/**
 * Credibility strip directly beneath the hero: a short trust statement plus a
 * horizontal, marquee-style logo rail. Logos are wordmark placeholders today —
 * drop real assets into /public/images and swap the <span> for <Image>.
 */
export function Trust() {
  return (
    <section
      aria-label="Trusted by"
      className="border-y border-[var(--pf-border)] bg-[var(--pf-surface)] py-10 sm:py-12"
    >
      <Container>
        <Reveal className="flex flex-col items-center gap-8">
          <p className="pf-eyebrow text-center text-[var(--pf-muted)]">
            {trust.statement}
          </p>

          {/* Marquee rail — duplicated track keeps the loop seamless. */}
          <div className="pf-marquee w-full">
            <ul className="pf-marquee__track" aria-hidden="false">
              {trust.logos.map((name) => (
                <li key={name} className="pf-marquee__item">
                  {name}
                </li>
              ))}
            </ul>
            <ul className="pf-marquee__track" aria-hidden="true">
              {trust.logos.map((name) => (
                <li key={name} className="pf-marquee__item">
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
