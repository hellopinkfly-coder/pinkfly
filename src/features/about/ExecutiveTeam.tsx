import { executiveTeam, type TeamMember } from "@/data/team";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { ImageFrame } from "@/components/shared/ImageFrame";
import { staggerContainer, fadeUp } from "@/components/motion/variants";

/**
 * Executive team.
 *
 * Driven entirely by `executiveTeam` in `src/data/team.ts` — adding a real
 * team member is a matter of appending one object, and the grid reflows.
 */
export function ExecutiveTeam({
  members = executiveTeam,
}: {
  members?: TeamMember[];
}) {
  if (members.length === 0) return null;

  return (
    <Section id="team">
      <SectionHeading
        eyebrow="Executive team"
        title="The people behind Pink Fly."
        intro="Photographs and biographies are placeholders until the team's final details are confirmed."
        align="left"
      />

      <Reveal
        as="ul"
        variants={staggerContainer}
        className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
      >
        {members.map((member, i) => (
          <Reveal as="li" key={`${member.role}-${i}`} variants={fadeUp} className="group">
            <ImageFrame
              src={member.image ?? ""}
              alt={`${member.name}, ${member.role}`}
              label={member.role}
              shape={i % 2 === 0 ? "arch" : "leaf"}
              aspect="aspect-[4/5]"
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
              className="shadow-[var(--pf-shadow-md)]"
            />
            <h3 className="mt-5 text-lg">{member.name}</h3>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--pf-accent)]">
              {member.role}
            </p>
            {member.bio && (
              <p className="mt-3 text-sm leading-relaxed text-[var(--pf-text)]">
                {member.bio}
              </p>
            )}
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="pf-link mt-3 inline-block text-sm"
              >
                LinkedIn ↗
              </a>
            )}
          </Reveal>
        ))}
      </Reveal>
    </Section>
  );
}
