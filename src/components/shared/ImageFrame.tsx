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
  /**
   * The uploaded picture's own shape (width ÷ height).
   *
   * When given, the frame takes this shape instead of `aspect`, so the whole
   * image is shown at its own proportions — nothing cropped, nothing
   * stretched, whatever size was uploaded. Pass it only where the layout can
   * absorb a changing height; a row of cards needs one fixed shape.
   */
  ratio?: number;
  className?: string;
  /** Responsive `sizes` hint for the image optimiser. */
  sizes?: string;
  priority?: boolean;
  /** Subtle zoom on hover — enable inside interactive cards. */
  hoverZoom?: boolean;
  /**
   * How the picture meets the frame.
   *
   * `cover` fills it and trims the overflow — right where the frame's shape
   * is the design. `contain` shows the whole picture inside the frame, so an
   * upload of any proportions arrives intact. What would otherwise be an
   * empty band beside it is filled by a blurred copy of the picture itself,
   * so the frame keeps its shape and the grid its rhythm while nothing is
   * cropped away.
   */
  fit?: "cover" | "contain";
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
  ratio,
  className,
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
  hoverZoom = true,
  fit = "cover",
}: ImageFrameProps) {
  return (
    <div
      className={cn(
        "pf-shape relative isolate bg-[var(--pf-surface-muted)]",
        `pf-shape-${shape}`,
        ratio ? undefined : aspect,
        className
      )}
      style={ratio ? { aspectRatio: ratio } : undefined}
    >
      {/* The backdrop, only where the picture does not fill the frame: the
          same image, blown out and blurred, so a portrait in a landscape
          frame sits on its own colours instead of a grey band. Hidden from
          assistive technology — it carries no information the real image
          does not. */}
      {fit === "contain" && (
        <Image
          src={src}
          alt=""
          aria-hidden
          fill
          sizes={sizes}
          className="scale-110 object-cover opacity-60 blur-2xl saturate-150"
        />
      )}

      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn(
          "transition-transform duration-700 ease-[var(--pf-ease)]",
          fit === "contain" ? "object-contain" : "object-cover",
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
