import { cn } from "@/lib/cn";

/**
 * Archive filter control (PRD 7.4). Mono type, active state in blue-400
 * (measured 4.62:1 on the page ground — see PRD 6.2 / scripts/check-contrast.mjs).
 */
export function FilterChip({
  active,
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        "rounded-control border px-4 py-2 font-mono text-[13px] uppercase tracking-[0.08em] transition-colors duration-150",
        active
          ? "border-blue-400 text-blue-400"
          : "border-ink-500 text-ink-300 hover:border-ink-300 hover:text-ink-100",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
