"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Menu as MenuIcon, X } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { LanguageDropdown, LanguageSegment } from "./language-switcher";
import { LiveClock } from "./live-clock";
import { useReservation } from "./reservation-context";

export function Logo({ className }: { className?: string }) {
  return (
    <a href="#top" className={cn("flex items-center gap-3", className)} aria-label={`${site.name} — home`}>
      {/* Placeholder mark: replace /public/logo.png with the restaurant's logo. */}
      <Image src="/logo.png" alt="" width={34} height={34} priority className="size-[34px]" />
      <span className="flex items-baseline gap-2">
        <span className="font-[family-name:var(--font-display)] text-[1.375rem] font-light tracking-[0.18em] uppercase">
          {site.name}
        </span>
        <span className="font-[family-name:var(--font-jp)] text-sm text-paper-mute">{site.kanji}</span>
      </span>
    </a>
  );
}

export function Header() {
  const { t } = useI18n();
  const { open } = useReservation();
  const [scrolled, setScrolled] = useState(false);
  const [sheet, setSheet] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = sheet ? "hidden" : "";
  }, [sheet]);

  const links = [
    { href: "#story", label: t.nav.story },
    { href: "#menu", label: t.nav.menu },
    { href: "#location", label: t.nav.location },
    { href: "#reservation", label: t.nav.reservation },
  ];

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-[background-color,border-color] duration-500",
        scrolled || sheet ? "border-b border-line bg-ink" : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-18 max-w-[90rem] items-center justify-between gap-6 px-5 sm:px-8 lg:px-12">
        <Logo />

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-9">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="text-[0.8125rem] tracking-[0.08em] text-paper-dim transition-colors hover:text-paper"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <span className="hidden xl:inline">
            <LiveClock city={t.status.city} />
          </span>
          <LanguageDropdown className="hidden sm:flex" />
          <Button size="sm" onClick={open} className="hidden sm:inline-flex">
            {t.nav.reserve}
          </Button>
          <button
            type="button"
            className="flex size-10 items-center justify-center text-paper lg:hidden"
            aria-expanded={sheet}
            aria-controls="mobile-nav"
            aria-label={sheet ? t.nav.close : t.nav.open}
            onClick={() => setSheet((s) => !s)}
          >
            {sheet ? <X className="size-5" strokeWidth={1.25} /> : <MenuIcon className="size-5" strokeWidth={1.25} />}
          </button>
        </div>
      </div>

      {/* Mobile / tablet sheet */}
      <div
        id="mobile-nav"
        hidden={!sheet}
        className="h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-line bg-ink px-5 pb-10 pt-8 sm:px-8 lg:hidden"
      >
        <nav aria-label="Mobile">
          <ol className="space-y-1">
            {links.map((l, i) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setSheet(false)}
                  className="flex items-baseline gap-5 border-b border-line py-5"
                >
                  <span className="eyebrow tabular-nums">0{i + 1}</span>
                  <span className="display text-3xl">{l.label}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="mt-10 space-y-6">
          <LanguageSegment />
          <Button
            size="lg"
            className="w-full"
            onClick={() => {
              setSheet(false);
              open();
            }}
          >
            {t.nav.reserve}
          </Button>
          <LiveClock city={t.status.city} />
        </div>
      </div>
    </header>
  );
}
