// Client-side: the orbit config carries icon components, which cannot cross
// the server/client boundary as props.
"use client";

import { proof } from "@/config/content";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/shared/Reveal";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { FlightScene } from "@/components/brand/FlightScene";
import { stagger, lift } from "@/components/motion/variants";

/**
 * The proof section — visual, icons, numbers and copy composed as one block
 * rather than a headline sitting above an unrelated stat strip. The scene
 * repeats the hero's flight visual on purpose: same brand, one page.
 */
export function Proof() {
  return (
    <Section id="proof" className="overflow-x-clip">
      <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        {/* Visual + orbiting icons */}
        <FlightScene
          orbit={proof.orbit}
          className="order-2 mx-auto w-full max-w-sm lg:order-1 lg:max-w-none"
        />

        {/* Numbers */}
        <div className="order-1 lg:order-2">
          <Reveal className="flex flex-col gap-4">
            <span className="pf-eyebrow">{proof.eyebrow}</span>
            <h2 className="pf-h2">{proof.headline}</h2>
            <p className="max-w-md text-lg leading-relaxed text-[var(--pf-text)]">
              {proof.subhead}
            </p>
          </Reveal>

          <Reveal
            as="ul"
            variants={stagger}
            className="mt-10 grid grid-cols-2 gap-x-8 gap-y-10"
          >
            {proof.stats.map((stat) => (
              <Reveal as="li" key={stat.label} variants={lift}>
                <span className="block font-[family-name:var(--font-display)] text-4xl font-bold leading-none text-[var(--pf-accent)] sm:text-5xl">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </span>
                <span className="mt-3 block text-sm leading-relaxed text-[var(--pf-text)]">
                  {stat.label}
                </span>
              </Reveal>
            ))}
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
