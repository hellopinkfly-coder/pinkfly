import type { Metadata } from "next";
import { CalendarDays, MapPin } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { stagger, lift } from "@/components/motion/variants";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Curated gatherings for women founders — roundtables, masterclasses, city meetups, and the annual Oinkfly summit.",
};

// TODO(pre-launch): swap for real listings, or wire to a CMS.
const events = [
  {
    type: "Masterclass",
    title: "Positioning your D2C brand to stand out",
    date: "Thu, 21 Aug 2026",
    location: "Online · 6:00 PM IST",
  },
  {
    type: "Founder meetup",
    title: "Mumbai founders' evening",
    date: "Sat, 6 Sep 2026",
    location: "Bandra, Mumbai",
  },
  {
    type: "Roundtable",
    title: "Raising your first round — what actually works",
    date: "Wed, 24 Sep 2026",
    location: "Online · 5:30 PM IST",
  },
  {
    type: "Summit",
    title: "Oinkfly Annual Founder Summit",
    date: "Fri–Sat, 14–15 Nov 2026",
    location: "Bengaluru",
  },
];

export default function EventsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Events"
        title="Rooms worth showing up for."
        intro="From intimate roundtables to city-wide summits, our gatherings are where relationships — and businesses — take off."
      />

      <Section>
        <SectionHeading eyebrow="What's next" title="Upcoming events." />
        <Reveal
          as="ul"
          variants={stagger}
          className="mt-12 grid gap-6 sm:grid-cols-2"
        >
          {events.map((event) => (
            <Reveal as="li" key={event.title} variants={lift}>
              <Card className="flex h-full flex-col">
                <span className="w-fit rounded-full bg-[var(--pf-accent-soft)] px-3 py-1 text-xs font-medium text-[var(--pf-accent-hover)]">
                  {event.type}
                </span>
                <h3 className="mt-4 text-xl">{event.title}</h3>
                <div className="mt-4 space-y-2 text-sm text-[var(--pf-text)]">
                  <p className="flex items-center gap-2">
                    <CalendarDays size={16} className="text-[var(--pf-accent)]" />
                    {event.date}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin size={16} className="text-[var(--pf-accent)]" />
                    {event.location}
                  </p>
                </div>
                <div className="mt-6 pt-2">
                  <Button href="/#join" variant="secondary" size="sm">
                    Register interest
                  </Button>
                </div>
              </Card>
            </Reveal>
          ))}
        </Reveal>
      </Section>
    </>
  );
}
