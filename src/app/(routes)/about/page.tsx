import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/PageHeader";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { stagger, lift } from "@/components/motion/variants";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Oinkfly is a long-term ecosystem for ambitious women founders in India — a flagship initiative by Noboru World.",
};

const values = [
  {
    title: "Belonging first",
    body: "One test for every decision: does this help a founder feel she's found her people?",
  },
  {
    title: "Substance over spectacle",
    body: "Real mentorship, real strategy, real rooms. No motivational filler.",
  },
  {
    title: "Built for the long run",
    body: "Not a campaign. An ecosystem meant to compound over decades.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About Oinkfly"
        title="For women who were told to be realistic."
        intro={`Oinkfly is a flagship initiative by ${siteConfig.parent}, building India's community for ambitious women founders.`}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <span className="pf-eyebrow">Our story</span>
            <h2 className="pf-h2 mt-4">Why we started.</h2>
          </Reveal>
          <Reveal
            className="space-y-5 text-lg leading-relaxed text-[var(--pf-text)]"
            delay={0.1}
          >
            <p>
              Too many brilliant women build alone — no mentors who understand
              them, no peers who cheer, no network that opens doors.
            </p>
            <p>
              Oinkfly is the fix. Mentorship, network, strategy, and
              accountability, from women who have already done it.
            </p>
            <p>
              Dreams become companies here. Companies become legacies.
            </p>
          </Reveal>
        </div>
      </Section>

      <Section className="bg-[var(--pf-surface)]">
        <SectionHeading eyebrow="What we believe" title="Our values." />
        <Reveal as="ul" variants={stagger} className="mt-12 grid gap-6 md:grid-cols-3">
          {values.map((v) => (
            <Reveal as="li" key={v.title} variants={lift}>
              <Card className="h-full">
                <h3 className="text-xl">{v.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--pf-text)]">
                  {v.body}
                </p>
              </Card>
            </Reveal>
          ))}
        </Reveal>
      </Section>

      <Section>
        <Reveal className="mx-auto flex max-w-xl flex-col items-center text-center">
          <span className="pf-eyebrow">Ready when you are</span>
          <h2 className="pf-h2 mt-4">Come build with us.</h2>
          <div className="mt-8">
            <Button href="/#join" size="lg">
              Join Oinkfly
            </Button>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
