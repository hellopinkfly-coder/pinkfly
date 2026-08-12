import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/PageHeader";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { staggerContainer, fadeUp } from "@/components/motion/variants";
import { mission } from "@/config/content";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Pink Fly is a long-term ecosystem for ambitious women entrepreneurs in India — a flagship initiative by Noboru World.",
};

const values = [
  {
    title: "Belonging first",
    body: "Every decision starts with one test: does this help a woman founder feel she's finally found her people?",
  },
  {
    title: "Substance over spectacle",
    body: "Real mentorship, real strategy, real rooms. No fluff, no vanity, no empty motivation.",
  },
  {
    title: "Built for the long run",
    body: "This isn't a campaign. It's an ecosystem designed to compound over decades.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About Pink Fly"
        title="A home for women who refuse to build alone."
        intro={`Pink Fly is a flagship initiative by ${siteConfig.parent}, on a mission to build India's most trusted community for ambitious women entrepreneurs.`}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <span className="pf-eyebrow">Our story</span>
            <h2 className="pf-h2 mt-4">Why we started.</h2>
          </Reveal>
          <Reveal className="space-y-5 text-lg leading-relaxed text-[var(--pf-text)]">
            <p>
              Too many brilliant women build their businesses in isolation —
              without mentors who understand them, peers who cheer them on, or a
              network that opens doors.
            </p>
            <p>
              Pink Fly exists to change that. We help women launch, scale, and
              conquer through mentorship, networking, education, accountability,
              and a founder community that genuinely has their back.
            </p>
            <p>
              This is the beginning of a long-term ecosystem — a place where
              dreams become companies, and companies become legacies.
            </p>
          </Reveal>
        </div>
      </Section>

      <Section className="bg-[var(--pf-surface)]">
        <SectionHeading eyebrow="What we believe" title="Our values." />
        <Reveal
          as="ul"
          variants={staggerContainer}
          className="mt-14 grid gap-6 md:grid-cols-3"
        >
          {values.map((v) => (
            <Reveal as="li" key={v.title} variants={fadeUp}>
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

      <Section id="mission">
        <SectionHeading
          eyebrow={mission.eyebrow}
          title="What drives everything we do."
          intro={mission.body}
        />
        <Reveal className="mt-10 flex justify-center">
          <Button href="/#join" size="lg">
            Join the community
          </Button>
        </Reveal>
      </Section>
    </>
  );
}
