import { cn } from "@/lib/cn";

/**
 * The one page-width constraint (PRD 3.E convention, brief section 21).
 * Side gutter never drops below 24px, even at phone width.
 */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[1400px] px-6 md:px-10 lg:px-20", className)}>
      {children}
    </div>
  );
}
