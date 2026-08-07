import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/shared/Reveal";
import { GradientBackdrop } from "@/components/shared/GradientBackdrop";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  intro?: string;
};

/** Consistent hero band for inner (sub-)pages. */
export function PageHeader({ eyebrow, title, intro }: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden pt-32 pb-12 sm:pt-40 sm:pb-16">
      <GradientBackdrop />
      <Container>
        <Reveal className="flex max-w-3xl flex-col gap-5">
          <span className="pf-eyebrow">{eyebrow}</span>
          <h1 className="pf-display text-[var(--pf-heading)]">{title}</h1>
          {intro && (
            <p className="max-w-2xl text-lg leading-relaxed text-[var(--pf-text)]">
              {intro}
            </p>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
