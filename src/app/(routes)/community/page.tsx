import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/PageHeader";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { staggerContainer, fadeUp } from "@/components/motion/variants";
import { community } from "@/config/content";

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
        intro="Pink Fly is a living network of founders, mentors, and operators who show up for each other — online and in the room."
      />

      <Section>
        <SectionHeading
          eyebrow={community.eyebrow}
          title="What being a member looks like."
        />
        <Reveal
          as="ul"
          variants={staggerContainer}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {community.offerings.map(({ icon: Icon, title, description }) => (
            <Reveal as="li" key={title} variants={fadeUp}>
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
          <p className="mt-4 text-lg text-[var(--pf-text)]">
            Membership is how it all begins. Join thousands of women building
            together.
          </p>
          <div className="mt-8">
            <Button href="/#join" size="lg">
              Join the community
            </Button>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
