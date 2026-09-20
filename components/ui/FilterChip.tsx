import { cn } from "@/lib/cn";

/** Filter control with a neutral high-contrast active state. */
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
          ? "border-ink-000 text-ink-000"
          : "border-ink-500 text-ink-300 hover:border-ink-300 hover:text-ink-100",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
