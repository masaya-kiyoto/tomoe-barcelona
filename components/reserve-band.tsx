"use client";

import Image from "next/image";
import { useI18n } from "@/lib/i18n";
import { photos, site } from "@/lib/site";
import { Button } from "./ui/button";
import { useReservation } from "./reservation-context";

export function ReserveBand() {
  const { t } = useI18n();
  const { open } = useReservation();
  const b = t.reserveBand;

  return (
    <section id="reservation" className="relative isolate overflow-hidden border-t border-line">
      <Image src={photos.chef} alt="" fill sizes="100vw" className="-z-20 object-cover object-center" />
      <div className="absolute inset-0 -z-10 bg-ink/82" />

      <div className="mx-auto grid max-w-[90rem] gap-10 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-12 lg:px-12 lg:py-40">
        <p className="eyebrow flex items-center gap-4 lg:col-span-3">
          <span className="tabular-nums text-paper-dim">{b.index}</span>
          <span className="h-px w-8 bg-line-strong" />
          {b.label}
        </p>
        <div className="lg:col-span-9">
          <h2 className="display max-w-3xl text-[2rem] text-balance sm:text-[2.75rem] lg:text-[3.25rem]">{b.title}</h2>
          <p className="mt-6 max-w-xl text-[0.9375rem] leading-relaxed text-paper-dim sm:text-base">{b.body}</p>
          <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
            <Button size="lg" onClick={open}>
              {b.cta}
            </Button>
            <p className="text-sm text-paper-dim">
              {b.phone}{" "}
              <a href={site.phoneHref} className="tabular-nums text-paper underline decoration-line-strong underline-offset-[6px] hover:decoration-brass">
                {site.phone}
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
