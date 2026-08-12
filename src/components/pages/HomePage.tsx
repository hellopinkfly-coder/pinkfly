import { Hero } from "@/features/hero/Hero";
import { Mission } from "@/features/mission/Mission";
import { Impact } from "@/features/impact/Impact";
import { Community } from "@/features/community/Community";
import { Testimonials } from "@/features/testimonials/Testimonials";
import { FinalCTA } from "@/features/final-cta/FinalCTA";
import { Newsletter } from "@/features/newsletter/Newsletter";
import { flags } from "@/config/flags";
import type { Region } from "@/lib/region";

/**
 * The homepage, in wireframe order:
 * hero carousel → why Pink Fly exists → impact → how we gather →
 * testimonials (hidden) → your seat is waiting → newsletter.
 *
 * One component serves every region; only the `region` object changes.
 */
export function HomePage({ region }: { region: Region }) {
  return (
    <>
      <Hero region={region} />
      <Mission region={region} />
      <Impact />
      <Community />
      {flags.testimonials && <Testimonials />}
      <FinalCTA region={region} />
      <Newsletter />
    </>
  );
}
