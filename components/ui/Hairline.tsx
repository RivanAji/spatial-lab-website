import { cn } from "@/lib/cn";

/**
 * Depth on the dark ground comes from surface steps and 1px hairlines
 * (PRD 6.4), never drop shadows. This is the hairline.
 */
export function Hairline({ className }: { className?: string }) {
  return <div className={cn("h-px w-full bg-ink-500", className)} aria-hidden="true" />;
}
