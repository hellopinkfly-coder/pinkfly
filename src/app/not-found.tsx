import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { GradientBackdrop } from "@/components/shared/GradientBackdrop";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[70vh] items-center overflow-hidden py-32">
      <GradientBackdrop />
      <Container>
        <div className="mx-auto max-w-xl text-left">
          <span className="pf-eyebrow">404</span>
          <h1 className="pf-h2 mt-4">This page has flown off somewhere.</h1>
          <p className="mt-5 leading-relaxed text-[var(--pf-text)]">
            The link may be out of date, or the region prefix may not exist.
            Try the homepage, or pick a region from the selector in the header.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/" size="lg">
              Back to the homepage
            </Button>
            <Button href="/events" variant="secondary" size="lg">
              Browse events
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
