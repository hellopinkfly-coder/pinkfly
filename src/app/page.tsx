import { Hero } from "@/features/hero/Hero";
import { Mission } from "@/features/mission/Mission";
import { Community } from "@/features/community/Community";
import { WhyPinkFly } from "@/features/why-pinkfly/WhyPinkFly";
import { Newsletter } from "@/features/newsletter/Newsletter";
import { FinalCTA } from "@/features/final-cta/FinalCTA";

// NOTE: <Impact /> and <FounderStories /> are intentionally hidden for the MVP.
// They remain fully built, reusable components and will be reintroduced in a
// future version — do not delete them.
// import { Impact } from "@/features/impact/Impact";
// import { FounderStories } from "@/features/founder-stories/FounderStories";

export default function Home() {
  return (
    <>
      <Hero />
      <Mission />
      <Community />
      <WhyPinkFly />
      <FinalCTA />
      <Newsletter />
    </>
  );
}
