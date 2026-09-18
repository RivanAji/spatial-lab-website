import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-control " +
  "px-7 py-3.5 font-body text-[15px] font-semibold transition-[transform,filter] " +
  "duration-150 active:translate-y-px active:scale-[0.98] " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300";

const variants: Record<Variant, string> = {
  // ink-000 on blue-600 measures 5.87:1 (PRD 6.2) — near-black text on this
  // blue fails at body size (3.22:1), so this is deliberately near-white.
  primary: "bg-blue-600 text-ink-000 hover:brightness-110",
  secondary:
    "border border-ink-500 text-ink-100 hover:border-blue-400 hover:text-ink-000",
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
