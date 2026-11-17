import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { LinkPending } from "./LinkPending";

/**
 * Press is the one state a phone actually has.
 *
 * Every variant below used to carry a hover treatment and nothing else, and
 * hover does not exist on a touch screen: a tap lit nothing up, so the button
 * sat there looking dead until the next page painted — which reads as the
 * site being slow rather than as the tap having registered. The press state
 * is what makes it feel immediate, and `active:duration-75` is the whole
 * point: the lift on hover can take its 300ms, but the answer to a finger has
 * to land now.
 */
const buttonVariants = cva(
  "inline-flex touch-manipulation items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-all duration-300 ease-[var(--pf-ease)] active:duration-75 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pf-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--pf-bg)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--pf-accent)] text-white shadow-[var(--pf-shadow-sm)] hover:bg-[var(--pf-accent-hover)] hover:-translate-y-0.5 hover:shadow-[var(--pf-shadow-md)] active:translate-y-0 active:bg-[var(--pf-accent-hover)] active:shadow-none",
        secondary:
          "border border-[var(--pf-border-strong)] bg-[var(--pf-surface)] text-[var(--pf-heading)] hover:-translate-y-0.5 hover:border-[var(--pf-accent)] hover:text-[var(--pf-accent)] active:translate-y-0 active:border-[var(--pf-accent)] active:bg-[var(--pf-surface-muted)] active:text-[var(--pf-accent)]",
        ghost:
          "text-[var(--pf-heading)] hover:bg-[var(--pf-surface-muted)] active:bg-[var(--pf-surface-muted)]",
        link: "text-[var(--pf-accent)] hover:text-[var(--pf-accent-hover)] active:text-[var(--pf-accent-hover)] rounded-none px-0",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-sm",
        lg: "h-13 px-8 py-3.5 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

type BaseProps = VariantProps<typeof buttonVariants> & {
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = BaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & {
    href?: undefined;
  };

type ButtonAsLink = BaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

/** Polymorphic button — renders a Next <Link> when `href` is provided. */
export function Button({ className, variant, size, ...props }: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size }), className);

  if ("href" in props && props.href !== undefined) {
    const { href, children, ...rest } = props as ButtonAsLink;
    const isExternal = /^https?:\/\//.test(href);
    if (isExternal) {
      return (
        <a
          href={href}
          className={classes}
          target="_blank"
          rel="noopener noreferrer"
          {...rest}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
        {/* Nothing until the router is actually working; see LinkPending. */}
        <LinkPending />
      </Link>
    );
  }

  const { children, ...rest } = props as ButtonAsButton;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}

export { buttonVariants };
