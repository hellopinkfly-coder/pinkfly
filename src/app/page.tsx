import { Hero } from "@/features/hero/Hero";
import { Manifesto } from "@/features/manifesto/Manifesto";
import { Proof } from "@/features/proof/Proof";
import { Offering } from "@/features/offering/Offering";
import { Stories } from "@/features/stories/Stories";
import { Join } from "@/features/join/Join";

/**
 * The homepage is one argument, in order:
 * who this is for → why it exists → that it works → what you get →
 * who says so → join.
 * Every section earns its place; nothing repeats another section's job.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Manifesto />
      <Proof />
      <Offering />
      <Stories />
      <Join />
    </>
  );
}
