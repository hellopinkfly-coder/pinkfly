import { HeroCarousel } from "./HeroCarousel";
import type { Region } from "@/lib/region";

/**
 * The homepage hero — a full-width banner carousel. Each slide carries its
 * own copy, proof points, CTA and photograph, so the fold changes message as
 * it advances rather than repeating one headline over four pictures.
 *
 * Region-aware: slide CTAs are prefixed so `/india` keeps a visitor in their
 * region rather than dropping them onto the global site.
 */
export function Hero({ region }: { region: Region }) {
  return <HeroCarousel region={region} />;
}
