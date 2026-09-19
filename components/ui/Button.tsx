import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-control " +
  "px-7 py-3.5 font-body text-[15px] font-semibold transition-[transform,filter] " +
  "duration-150 active:translate-y-px active:scale-[0.98] " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-000";

const variants: Record<Variant, string> = {
  // Monochrome pivot (2026-09-19) — was bg-blue-600/text-ink-000. White
  // fill, near-black text: the same bg-foreground/text-background
  // pairing the reference (github.com/DavidHDev/rbp-portfolio) uses for
  // its own primary button, and the highest-contrast pairing available
  // on this palette (ink-000/ink-900 measures 18.87:1, PRD 6.2's own
  // check for that exact pair).
  primary: "bg-ink-000 text-ink-900 hover:brightness-90",
  secondary:
    "border border-ink-500 text-ink-100 hover:border-ink-000 hover:text-ink-000",
};

type CommonProps = {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsLink = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children"> & {
    href: string;
  };

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
  };

type ButtonProps = ButtonAsLink | ButtonAsButton;

/**
 * Real interactive elements only (craft.md, PRD 6.4): an `<a>` when `href`
 * is given, a real `<button>` otherwise. Never a styled `<div>`.
 */
export function Button({ variant = "primary", className, children, ...props }: ButtonProps) {
  const classes = cn(base, variants[variant], className);

  if ("href" in props && props.href) {
    const { href, ...rest } = props;
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} {...(props as ButtonAsButton)}>
      {children}
    </button>
  );
}
