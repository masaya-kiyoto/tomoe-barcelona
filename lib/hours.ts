import { schedule, site, type Service } from "./site";

/** Current wall-clock time in Barcelona, independent of the visitor's time zone. */
export function barcelonaNow(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: site.timeZone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "00";
  const weekdayMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  const h = Number(get("hour"));
  const m = Number(get("minute"));
  const s = Number(get("second"));
  return { day: weekdayMap[get("weekday")] ?? 0, minutes: h * 60 + m, h, m, s };
}

const toMin = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

export function servicesFor(day: number): Service[] {
  const d = schedule[day];
  return [d.lunch, d.dinner].filter(Boolean) as Service[];
}

export function formatServices(day: number) {
  return servicesFor(day)
    .map((s) => `${s.open} – ${s.close}`)
    .join(" / ");
}

export type OpenStatus =
  | { kind: "open"; until: string; todayHours: string }
  | { kind: "later"; todayHours: string; next: { day: number; time: string } }
  | { kind: "closedToday"; next: { day: number; time: string } };

export function openStatus(now = barcelonaNow()): OpenStatus {
  const today = servicesFor(now.day);
  const current = today.find((s) => now.minutes >= toMin(s.open) && now.minutes < toMin(s.close));
  if (current) return { kind: "open", until: current.close, todayHours: formatServices(now.day) };

  const laterToday = today.find((s) => now.minutes < toMin(s.open));
  if (laterToday) {
    return { kind: "later", todayHours: formatServices(now.day), next: { day: now.day, time: laterToday.open } };
  }

  for (let i = 1; i <= 7; i++) {
    const d = (now.day + i) % 7;
    const first = servicesFor(d)[0];
    if (first) {
      return today.length
        ? { kind: "later", todayHours: formatServices(now.day), next: { day: d, time: first.open } }
        : { kind: "closedToday", next: { day: d, time: first.open } };
    }
  }
  return { kind: "closedToday", next: { day: now.day, time: "" } };
}

/** Localised weekday name, Monday-first index helpers. */
export function weekdayName(day: number, intl: string, style: "long" | "short" = "long") {
  // 2023-01-01 was a Sunday.
  const ref = new Date(Date.UTC(2023, 0, 1 + day, 12));
  return new Intl.DateTimeFormat(intl, { weekday: style, timeZone: "UTC" }).format(ref);
}
