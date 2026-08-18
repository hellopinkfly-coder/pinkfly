import { Hero } from "@/features/hero/Hero";
import { FinalCTA } from "@/features/final-cta/FinalCTA";
import { Impact } from "@/features/impact/Impact";
import { Community } from "@/features/community/Community";
import { Testimonials } from "@/features/testimonials/Testimonials";
import { Mission } from "@/features/mission/Mission";
import { Join } from "@/features/join/Join";
import { flags } from "@/config/flags";
import type { Region } from "@/lib/region";

/**
 * The homepage, in the order the wireframe sets out:
 * hero carousel → join CTA → impact → how we gather →
 * testimonials (hidden) → why Pink Fly → join + newsletter.
 *
 * One component serves every region; only the `region` object changes.
 */
export function HomePage({ region }: { region: Region }) {
  return (
    <>
      <Hero region={region} />
      <FinalCTA region={region} />
      <Impact />
      <Community />
      {flags.testimonials && <Testimonials />}
      <Mission region={region} />
      <Join region={region} />
    </>
  );
}
