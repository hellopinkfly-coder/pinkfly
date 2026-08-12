import Image from "next/image";
import { cn } from "@/lib/utils";

export type FrameShape = "rect" | "arch" | "blob" | "leaf" | "pill";

type ImageFrameProps = {
  src: string;
  alt: string;
  /** Caption chip rendered in the bottom-right corner of the image. */
  label?: string;
  /** Organic silhouette applied to the frame. */
  shape?: FrameShape;
  /** Tailwind aspect utility, e.g. `aspect-[4/5]`. */
  aspect?: string;
  className?: string;
  /** Responsive `sizes` hint for the image optimiser. */
  sizes?: string;
  priority?: boolean;
  /** Subtle zoom on hover — enable inside interactive cards. */
  hoverZoom?: boolean;
};

/**
 * The one way images are rendered on this site.
 *
 * Handles the organic shapes, the bottom-right label chip, the gradient
 * scrim that keeps that label legible, and the hover treatment — so every
 * image across the site behaves consistently.
 */
export function ImageFrame({
  src,
  alt,
  label,
  shape = "rect",
  aspect = "aspect-[4/3]",
  className,
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
  hoverZoom = true,
}: ImageFrameProps) {
  return (
    <div
      className={cn(
        "pf-shape relative isolate bg-[var(--pf-surface-muted)]",
        `pf-shape-${shape}`,
        aspect,
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn(
          "object-cover transition-transform duration-700 ease-[var(--pf-ease)]",
          hoverZoom && "group-hover:scale-[1.04]"
        )}
      />
      {label && (
        <>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-1/3 bg-gradient-to-t from-black/45 to-transparent"
          />
          <span
            className={cn(
              "pf-image-label",
              // A rounded bottom-right corner would clip a corner-set chip.
              (shape === "leaf" || shape === "blob" || shape === "pill") &&
                "pf-image-label-centered"
            )}
          >
            {label}
          </span>
        </>
      )}
    </div>
  );
}
