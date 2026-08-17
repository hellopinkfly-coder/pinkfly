import { Hero } from "@/features/hero/Hero";
import { Manifesto } from "@/features/manifesto/Manifesto";
import { Proof } from "@/features/proof/Proof";
import { Offering } from "@/features/offering/Offering";
import { Stories } from "@/features/stories/Stories";
import { Join } from "@/features/join/Join";
import { flags } from "@/config/flags";
import type { Region } from "@/lib/region";

/**
 * The Oinkfly homepage, in order:
 * who this is for → why it exists → that it works → what you get →
 * who says so → join.
 *
 * Every section earns its place and none repeats another's job. One component
 * serves every region; only the `region` object changes.
 *
 * The earlier Mission / Impact / Community / Testimonials / Newsletter
 * sections still exist and still power the About, Events and Knowledge Base
 * pages — they are simply no longer part of this flow.
 */
export function HomePage({ region }: { region: Region }) {
  return (
    <>
      <Hero region={region} />
      <Manifesto />
      <Proof />
      <Offering />
      {flags.testimonials && <Stories />}
      <Join region={region} />
    </>
  );
}
