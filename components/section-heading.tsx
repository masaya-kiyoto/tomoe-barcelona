import { cn } from "@/lib/utils";

/** Numbered section heading — “01 — Story” — after the reference sites' editorial rhythm. */
export function SectionHeading({
  index,
  label,
  title,
  intro,
  className,
}: {
  index: string;
  label: string;
  title: string;
  intro?: string;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-8 lg:grid-cols-12", className)}>
      <p className="eyebrow flex items-center gap-4 lg:col-span-3">
        <span className="tabular-nums text-paper-dim">{index}</span>
        <span className="h-px w-8 bg-line-strong" />
        {label}
      </p>
      <div className="lg:col-span-9">
        <h2 className="display max-w-3xl text-[2rem] text-balance sm:text-[2.75rem] lg:text-[3.25rem]">{title}</h2>
        {intro && <p className="mt-6 max-w-2xl text-[0.9375rem] leading-relaxed text-paper-dim sm:text-base">{intro}</p>}
      </div>
    </div>
  );
}
