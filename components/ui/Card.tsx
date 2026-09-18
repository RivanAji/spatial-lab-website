import { cn } from "@/lib/cn";

/**
 * Used only where elevation communicates real hierarchy (PRD 6.4) — the
 * Research Archive grid, not every grouped block on the site. No shadow;
 * depth is the ink-700 surface against the ink-900 ground plus a hairline.
 */
export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-panel border border-ink-500 bg-ink-700 transition-transform duration-200",
        className,
      )}
    >
      {children}
    </div>
  );
}
