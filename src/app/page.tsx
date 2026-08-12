import { Hero } from "@/features/hero/Hero";
import { Trust } from "@/features/trust/Trust";
import { Mission } from "@/features/mission/Mission";
import { Community } from "@/features/community/Community";
import { ValueSpotlight } from "@/features/value/ValueSpotlight";
import { FinalCTA } from "@/features/final-cta/FinalCTA";

// NOTE: <Impact />, <FounderStories />, <WhyPinkFly /> and <Newsletter /> are
// intentionally not part of the homepage flow — the approved wireframe does not
// include them. They remain fully built, reusable components and can be
// reintroduced (or used on sub-pages) later — do not delete them.
// import { Impact } from "@/features/impact/Impact";
// import { FounderStories } from "@/features/founder-stories/FounderStories";
// import { WhyPinkFly } from "@/features/why-pinkfly/WhyPinkFly";
// import { Newsletter } from "@/features/newsletter/Newsletter";

/**
 * Homepage flow, per the approved wireframe:
 * Header → Hero → Trust → Introduction → Benefits → Value → CTA → Footer
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Trust />
      <Mission />
      <Community />
      <ValueSpotlight />
      <FinalCTA />
    </>
  );
}
