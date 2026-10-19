"use client";

import { useEffect, useState } from "react";
import { barcelonaNow } from "@/lib/hours";

/** Ticks every second; renders nothing until mounted to avoid hydration mismatch. */
export function useBarcelonaTime(intervalMs = 1000) {
  const [now, setNow] = useState<ReturnType<typeof barcelonaNow> | null>(null);
  useEffect(() => {
    const tick = () => setNow(barcelonaNow());
    tick();
    const id = setInterval(tick, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

const pad = (n: number) => String(n).padStart(2, "0");

export function LiveClock({ city }: { city: string }) {
  const now = useBarcelonaTime();
  return (
    <span className="eyebrow tabular-nums" aria-hidden>
      {city} — {now ? `${pad(now.h)} : ${pad(now.m)} : ${pad(now.s)}` : "-- : -- : --"}
    </span>
  );
}
