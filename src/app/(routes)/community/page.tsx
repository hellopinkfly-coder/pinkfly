import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/PageHeader";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { stagger, lift } from "@/components/motion/variants";
import { offering } from "@/config/content";

export const metadata: Metadata = {
  title: "Community",
  description:
    "Networking, mentorship, events, masterclasses, and founder meetups — everything a woman founder needs, and the people to do it with.",
};

export default function CommunityPage() {
  return (
    <>
      <PageHeader
        eyebrow="The community"
        title="Your people are already here."
        intro="A living network of founders, mentors, and operators who show up for each other — online and in the room."
      />

      <Section>
        <SectionHeading
          eyebrow={offering.eyebrow}
          title="What membership looks like."
        />
        <Reveal
          as="ul"
          variants={stagger}
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {offering.items.map(({ icon: Icon, title, description }) => (
            <Reveal as="li" key={title} variants={lift}>
              <Card className="h-full">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--pf-accent-soft)] text-[var(--pf-accent)]">
                  <Icon size={22} />
                </span>
                <h3 className="mt-5 text-xl">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--pf-text)]">
                  {description}
                </p>
              </Card>
            </Reveal>
          ))}
        </Reveal>
      </Section>

      <Section className="bg-[var(--pf-surface)]">
        <Reveal className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <span className="pf-eyebrow">Ready when you are</span>
          <h2 className="pf-h2 mt-4">Find your people.</h2>
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
