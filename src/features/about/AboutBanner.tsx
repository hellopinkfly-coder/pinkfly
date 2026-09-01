import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/shared/Reveal";
import { ImageFrame } from "@/components/shared/ImageFrame";
import type { AboutContent } from "@/lib/cms/content";

/**
 * The large contextual banner that sits between "Why PinkFly exists" and
 * the founder story, as the About wireframe lays it out. It breaks out past
 * the text container on wide screens so it reads as a full-bleed moment.
 */
export function AboutBanner({ image }: { image: AboutContent["banner"]["image"] }) {

  return (
    <section className="py-4 sm:py-8">
      <Container className="max-w-7xl">
        <Reveal className="group">
          <ImageFrame
            src={image.src}
            alt={image.alt}
            label={image.label}
            shape="rect"
            aspect="aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9]"
            sizes="(max-width: 1280px) 94vw, 1240px"
            priority
            className="shadow-[var(--pf-shadow-lg)]"
          />
        </Reveal>
      </Container>
    </section>
  );
}
