import { ArrowRight } from "lucide-react";
import { finalCta } from "@/config/content";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/shared/Reveal";
import { GradientBackdrop } from "@/components/shared/GradientBackdrop";
import { Button } from "@/components/ui/button";

export function FinalCTA() {
  return (
    <Section bleed className="relative overflow-hidden">
      <GradientBackdrop />
      <Container>
        <Reveal className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <span className="pf-eyebrow">{finalCta.eyebrow}</span>
          <h2 className="pf-h2 mt-4">{finalCta.headline}</h2>
          <p className="mt-5 max-w-xl text-lg text-[var(--pf-text)]">
            {finalCta.body}
          </p>
          <div className="mt-8">
            <Button href={finalCta.cta.href} size="lg">
              {finalCta.cta.label}
              <ArrowRight size={18} />
            </Button>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
