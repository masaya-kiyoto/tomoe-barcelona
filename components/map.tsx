"use client";

import { ArrowUpRight } from "lucide-react";
import { intlLocale, useI18n } from "@/lib/i18n";
import { weekdayName } from "@/lib/hours";
import { mapsEmbedUrl, mapsOpenUrl, schedule, site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./section-heading";
import { useBarcelonaTime } from "./live-clock";

const weekOrder = [1, 2, 3, 4, 5, 6, 0]; // Monday first, as in Spain

export function Location() {
  const { t, locale } = useI18n();
  const l = t.location;
  const now = useBarcelonaTime(60_000);
  const today = now?.day ?? -1; // unknown until mounted, avoids hydration mismatch

  return (
    <section id="location" className="border-t border-line">
      <div className="mx-auto max-w-[90rem] px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40">
        <SectionHeading index={l.index} label={l.label} title={l.title} />

        <div className="mt-16 grid gap-12 sm:mt-20 lg:grid-cols-12 lg:gap-16">
          {/* Map */}
          <div className="lg:order-2 lg:col-span-7">
            <div className="relative aspect-[4/3] overflow-hidden border border-line bg-ink-3 sm:aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[34rem]">
              <iframe
                title={l.mapTitle}
                src={mapsEmbedUrl}
                className="map-dark absolute inset-0 size-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Details */}
          <div className="lg:order-1 lg:col-span-5">
            <dl className="divide-y divide-line border-y border-line">
              <div className="grid gap-3 py-7 sm:grid-cols-[10rem_1fr]">
                <dt className="eyebrow pt-1">{l.addressLabel}</dt>
                <dd>
                  <address className="not-italic leading-relaxed">
                    {site.address.line1}
                    <br />
                    {site.address.line2}
                    <br />
                    <span className="text-paper-dim">{site.address.country}</span>
                  </address>
                  <a
                    href={mapsOpenUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex h-11 items-center gap-2 border border-line-strong px-5 text-[0.8125rem] font-medium tracking-[0.06em] transition-colors hover:border-paper"
                  >
                    {l.openInMaps}
                    <ArrowUpRight className="size-4" strokeWidth={1.5} />
                  </a>
                </dd>
              </div>

              <div className="grid gap-3 py-7 sm:grid-cols-[10rem_1fr]">
                <dt className="eyebrow pt-1">{l.hoursLabel}</dt>
                <dd>
                  <table className="w-full text-sm">
                    <thead className="sr-only">
                      <tr>
                        <th>Day</th>
                        <th>{l.lunch}</th>
                        <th>{l.dinner}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {weekOrder.map((d) => {
                        const s = schedule[d];
                        const closed = !s.lunch && !s.dinner;
                        return (
                          <tr key={d} className={cn("align-top", d === today ? "text-paper" : "text-paper-dim")}>
                            <th scope="row" className="py-1.5 pr-4 text-left font-normal capitalize">
                              {weekdayName(d, intlLocale[locale], "short")}
                              {d === today && <span className="ml-2 inline-block size-1 -translate-y-0.5 rounded-full bg-brass" />}
                            </th>
                            {closed ? (
                              <td colSpan={2} className="py-1.5 text-paper-mute">
                                {l.closed}
                              </td>
                            ) : (
                              <>
                                <td className="py-1.5 pr-4 tabular-nums">{s.lunch ? `${s.lunch.open}–${s.lunch.close}` : "—"}</td>
                                <td className="py-1.5 tabular-nums">{s.dinner ? `${s.dinner.open}–${s.dinner.close}` : "—"}</td>
                              </>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </dd>
              </div>

              <div className="grid gap-3 py-7 sm:grid-cols-[10rem_1fr]">
                <dt className="eyebrow pt-1">{l.transportLabel}</dt>
                <dd className="text-sm leading-relaxed text-paper-dim">{l.transport}</dd>
              </div>

              <div className="grid gap-3 py-7 sm:grid-cols-[10rem_1fr]">
                <dt className="eyebrow pt-1">{l.dressLabel}</dt>
                <dd className="text-sm leading-relaxed text-paper-dim">{l.dress}</dd>
              </div>

              <div className="grid gap-3 py-7 sm:grid-cols-[10rem_1fr]">
                <dt className="eyebrow pt-1">{l.contactLabel}</dt>
                <dd className="space-y-1 text-sm">
                  <a href={site.phoneHref} className="block tabular-nums hover:text-brass">
                    {site.phone}
                  </a>
                  <a href={`mailto:${site.email}`} className="block break-all text-paper-dim hover:text-brass">
                    {site.email}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
