"use client";

import Image from "next/image";
import { useI18n } from "@/lib/i18n";
import { photos, site } from "@/lib/site";
import { Button } from "./ui/button";
import { OpenStatus } from "./open-status";
import { useReservation } from "./reservation-context";

export function Hero() {
  const { t } = useI18n();
  const { open } = useReservation();

  return (
    <section id="top" className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden">
      <Image
        src={photos.hero}
        alt="Nigiri served on a black slate at the counter"
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-[60%_center]"
      />
      {/* Legibility scrim — darkens the lower-left where the copy sits. */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/70 to-ink/30" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/80 via-ink/20 to-transparent" />

      <div className="mx-auto w-full max-w-[90rem] px-5 pb-12 pt-32 sm:px-8 sm:pb-16 lg:px-12 lg:pb-20">
        <div className="grid items-end gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8 xl:col-span-7">
            <p className="eyebrow animate-fade-up">{t.hero.eyebrow}</p>
            <h1 className="display mt-6 text-[2.375rem] text-balance animate-fade-up [animation-delay:120ms] sm:text-5xl lg:text-[4rem] xl:text-[4.5rem]">
              {t.hero.title}
            </h1>
            <p className="mt-7 max-w-xl text-[0.9375rem] leading-relaxed text-paper-dim animate-fade-up [animation-delay:240ms] sm:text-base">
              {t.hero.lead}
            </p>

            <OpenStatus className="mt-8 animate-fade-up [animation-delay:320ms]" />

            <div className="mt-9 flex flex-col gap-3 animate-fade-up [animation-delay:400ms] sm:flex-row sm:gap-4">
              <Button size="lg" onClick={open}>
                {t.hero.book}
              </Button>
              <a
                href="#menu"
                className="inline-flex h-13 items-center justify-center border border-line-strong px-8 text-sm font-medium tracking-[0.06em] text-paper transition-colors duration-300 hover:border-paper"
              >
                {t.hero.viewMenu}
              </a>
            </div>
          </div>

          <dl className="hidden gap-8 border-t border-line pt-6 lg:col-span-4 lg:col-start-9 lg:grid lg:grid-cols-2 xl:col-span-3 xl:col-start-10">
            <div>
              <dt className="eyebrow">{site.address.line1}</dt>
              <dd className="mt-2 text-sm text-paper-dim">{site.address.line2}</dd>
            </div>
            <div>
              <dt className="eyebrow">{t.hero.counter}</dt>
              <dd className="mt-2 text-sm text-paper-dim">{t.hero.room}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
