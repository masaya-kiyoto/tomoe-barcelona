"use client";

import { ArrowUpRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { formatServices } from "@/lib/hours";
import { site } from "@/lib/site";
import { LanguageSegment } from "./language-switcher";
import { Logo } from "./header";

export function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-[90rem] px-5 pb-10 pt-16 sm:px-8 sm:pt-20 lg:px-12">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-paper-dim">{t.footer.tagline}</p>
          </div>

          <div className="lg:col-span-3">
            <p className="eyebrow">{t.location.addressLabel}</p>
            <address className="mt-4 text-sm not-italic leading-relaxed text-paper-dim">
              {site.address.line1}
              <br />
              {site.address.line2}
              <br />
              <a href={site.phoneHref} className="mt-2 inline-block tabular-nums text-paper hover:text-brass">
                {site.phone}
              </a>
            </address>
          </div>

          <div className="lg:col-span-2">
            <p className="eyebrow">{t.location.hoursLabel}</p>
            <p className="mt-4 text-sm leading-relaxed text-paper-dim tabular-nums">
              {t.location.lunch} {formatServices(2).split(" / ")[0]}
              <br />
              {t.location.dinner} {formatServices(2).split(" / ")[1]}
            </p>
          </div>

          <div className="lg:col-span-3">
            <p className="eyebrow">{t.footer.follow}</p>
            <ul className="mt-4 space-y-2 text-sm">
              {[
                ["Instagram", site.instagram],
                ["Tripadvisor", site.tripadvisor],
              ].map(([label, href]) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-paper-dim transition-colors hover:text-paper"
                  >
                    {label}
                    <ArrowUpRight className="size-3.5" strokeWidth={1.5} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-line pt-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <span className="eyebrow">{t.footer.language}</span>
            <LanguageSegment />
          </div>
          <p className="text-[0.75rem] text-paper-mute">
            © {year} {site.name}. {t.footer.rights}
          </p>
        </div>

        <p className="mt-8 max-w-3xl text-[0.6875rem] leading-relaxed text-paper-mute">{t.footer.demo}</p>
      </div>
    </footer>
  );
}
