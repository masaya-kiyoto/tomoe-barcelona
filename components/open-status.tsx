"use client";

import { fmt, intlLocale, useI18n } from "@/lib/i18n";
import { openStatus, weekdayName } from "@/lib/hours";
import { cn } from "@/lib/utils";
import { useBarcelonaTime } from "./live-clock";

/** Real-time service status computed in Barcelona time (Europe/Madrid). */
export function OpenStatus({ className }: { className?: string }) {
  const { t, locale } = useI18n();
  const now = useBarcelonaTime(30_000);

  if (!now) return <p className={cn("h-5", className)} aria-hidden />;

  const s = openStatus(now);
  const isOpen = s.kind === "open";
  const day = (d: number) => weekdayName(d, intlLocale[locale]);

  const headline = isOpen ? t.status.openNow : s.kind === "closedToday" ? t.status.closedToday : t.status.closedNow;

  return (
    <p className={cn("flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.8125rem] text-paper-dim", className)}>
      <span className="flex items-center gap-2 text-paper">
        <span className="relative flex size-1.5">
          {isOpen && <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#8fbf8a] opacity-60" />}
          <span className={cn("relative inline-flex size-1.5 rounded-full", isOpen ? "bg-[#8fbf8a]" : "bg-paper-mute")} />
        </span>
        {headline}
      </span>
      {s.kind !== "closedToday" && (
        <span className="tabular-nums">
          {t.status.today}: {s.todayHours}
        </span>
      )}
      {s.kind !== "open" && (
        <span className="tabular-nums text-paper-mute">
          {fmt(t.status.nextOpen, { day: s.next.day === now.day ? "" : day(s.next.day), time: s.next.time }).replace(
            /\s{2,}/g,
            " ",
          )}
        </span>
      )}
    </p>
  );
}
