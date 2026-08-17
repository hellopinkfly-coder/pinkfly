import { manifesto } from "@/config/content";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/shared/Reveal";
import { OinkflyMark } from "@/components/brand/OinkflyMark";

/**
 * A short editorial band between the hero and the proof. Deliberately not a
 * card grid — the page needs one place to breathe and just say something.
 * The marquee underneath is the flight path, spelled out.
 */
export function Manifesto() {
  const track = [...manifesto.marquee, ...manifesto.marquee];

  return (
    <Section bleed className="border-y border-[var(--pf-border)] bg-[var(--pf-surface)] py-16 sm:py-20">
      <Container>
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className="pf-eyebrow">{manifesto.eyebrow}</span>
          <h2 className="pf-h2 mt-4">{manifesto.headline}</h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-[var(--pf-text)]">
            {manifesto.body}
          </p>
        </Reveal>
      </Container>

      {/* Flight path marquee */}
      <Reveal className="pf-marquee-mask mt-12 overflow-hidden" delay={0.15}>
        <div className="pf-marquee" style={{ ["--pf-marquee-duration" as string]: "42s" }}>
          {track.map((word, i) => (
            <span
              key={`${word}-${i}`}
              aria-hidden={i >= manifesto.marquee.length}
              className="pf-on-surface flex shrink-0 items-center gap-6 whitespace-nowrap px-6 font-[family-name:var(--font-display)] text-lg font-bold uppercase tracking-[0.18em] text-[var(--pf-heading)] sm:text-2xl"
            >
              {word}
              <OinkflyMark
                size={22}
                wing={0.5}
                className="shrink-0 text-[var(--pf-accent)]"
                aria-hidden
              />
            </span>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
