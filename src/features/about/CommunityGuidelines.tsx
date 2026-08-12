import { about } from "@/config/content";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/shared/Reveal";
import { ImageFrame } from "@/components/shared/ImageFrame";
import { staggerContainer, fadeUp } from "@/components/motion/variants";

/** The agreements that hold the community together. */
export function CommunityGuidelines() {
  const { guidelines } = about;

  return (
    <Section id="community-guidelines">
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <Reveal className="group">
          <span className="pf-eyebrow">{guidelines.eyebrow}</span>
          <h2 className="pf-h2 mt-4">{guidelines.headline}</h2>
          <p className="mt-5 text-base leading-relaxed text-[var(--pf-text)]">
            {guidelines.intro}
          </p>
          <ImageFrame
            src={guidelines.image.src}
            alt={guidelines.image.alt}
            label={guidelines.image.label}
            shape="leaf"
            aspect="aspect-[5/4]"
            sizes="(max-width: 1024px) 90vw, 38vw"
            className="mt-8 shadow-[var(--pf-shadow-md)]"
          />
        </Reveal>

        <Reveal as="ul" variants={staggerContainer} className="grid gap-px overflow-hidden rounded-[var(--pf-radius-xl)] border border-[var(--pf-border)] bg-[var(--pf-border)] sm:grid-cols-2">
          {guidelines.items.map((item, i) => (
            <Reveal
              as="li"
              key={item.title}
              variants={fadeUp}
              className="flex flex-col gap-2 bg-[var(--pf-surface)] p-7 transition-colors duration-300 hover:bg-[var(--pf-surface-muted)]"
            >
              <span className="font-[family-name:var(--font-display)] text-sm font-bold text-[var(--pf-accent)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-base">{item.title}</h3>
              <p className="text-sm leading-relaxed text-[var(--pf-text)]">
                {item.description}
              </p>
            </Reveal>
          ))}
        </Reveal>
      </div>
    </Section>
  );
}
