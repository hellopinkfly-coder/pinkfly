import type { Metadata } from "next";
import { ArrowUpRight, BookOpen, Megaphone, PiggyBank, Scale, Users2, Wrench } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { Card } from "@/components/ui/card";
import { stagger, lift } from "@/components/motion/variants";

export const metadata: Metadata = {
  title: "Knowledge Base",
  description:
    "Playbooks, guides, and resources for women founders — from first sale to scaling, fundraising, and beyond.",
};

// TODO(pre-launch): link each topic to real articles, or wire to a CMS.
const topics = [
  {
    icon: Wrench,
    title: "Getting started",
    description: "Idea validation, first customers, and building your MVP.",
    count: "12 guides",
  },
  {
    icon: Megaphone,
    title: "Marketing & brand",
    description: "Positioning, content, and growth for lean teams.",
    count: "18 guides",
  },
  {
    icon: PiggyBank,
    title: "Fundraising",
    description: "From bootstrapping to your first institutional round.",
    count: "9 guides",
  },
  {
    icon: Users2,
    title: "Hiring & team",
    description: "Building a team and a culture that scales with you.",
    count: "7 guides",
  },
  {
    icon: Scale,
    title: "Legal & finance",
    description: "The essentials — compliance, contracts, and cashflow.",
    count: "10 guides",
  },
  {
    icon: BookOpen,
    title: "Founder mindset",
    description: "Resilience, focus, and leading through the hard days.",
    count: "8 guides",
  },
];

export default function KnowledgeBasePage() {
  return (
    <>
      <PageHeader
        eyebrow="Knowledge Base"
        title="Everything we wish we'd known earlier."
        intro="A growing library of practical, no-fluff playbooks — written for women building real businesses."
      />

      <Section>
        <SectionHeading eyebrow="Browse by topic" title="Where do you want to grow?" />
        <Reveal
          as="ul"
          variants={stagger}
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {topics.map(({ icon: Icon, title, description, count }) => (
            <Reveal as="li" key={title} variants={lift}>
              <Card className="group flex h-full flex-col hover:-translate-y-1 hover:border-[var(--pf-accent)]/30 hover:shadow-[var(--pf-shadow-md)]">
                <div className="flex items-start justify-between">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--pf-accent-soft)] text-[var(--pf-accent)]">
                    <Icon size={22} />
                  </span>
                  <ArrowUpRight
                    size={20}
                    className="text-[var(--pf-muted)] transition-colors group-hover:text-[var(--pf-accent)]"
                  />
                </div>
                <h3 className="mt-5 text-xl">{title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--pf-text)]">
                  {description}
                </p>
                <p className="mt-4 text-xs font-medium uppercase tracking-wider text-[var(--pf-muted)]">
                  {count}
                </p>
              </Card>
            </Reveal>
          ))}
        </Reveal>
      </Section>
    </>
  );
}
