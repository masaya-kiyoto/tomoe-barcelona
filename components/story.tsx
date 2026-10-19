"use client";

import Image from "next/image";
import { useI18n } from "@/lib/i18n";
import { photos } from "@/lib/site";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./section-heading";

type Card = { kicker: string; title: string; body: string };

function PhotoCard({
  card,
  src,
  alt,
  className,
  large,
}: {
  card: Card;
  src: string;
  alt: string;
  className?: string;
  large?: boolean;
}) {
  return (
    <article className={cn("group relative isolate flex min-h-[24rem] flex-col justify-end overflow-hidden bg-ink-3", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={large ? "(min-width:1024px) 66vw, 100vw" : "(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw"}
        className="-z-20 object-cover transition-transform duration-[1.6s] ease-[var(--ease-calm)] group-hover:scale-[1.03]"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/55 to-transparent" />
      <div className={cn("p-6 sm:p-8", large && "lg:p-10")}>
        <p className="eyebrow text-brass/90">{card.kicker}</p>
        <h3 className={cn("display mt-3 text-2xl", large && "sm:text-3xl lg:text-[2.5rem]")}>{card.title}</h3>
        <p className={cn("mt-3 max-w-md text-sm leading-relaxed text-paper-dim", large && "sm:text-[0.9375rem]")}>
          {card.body}
        </p>
      </div>
    </article>
  );
}

export function Story() {
  const { t } = useI18n();
  const s = t.story;

  return (
    <section id="story" className="mx-auto max-w-[90rem] px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40">
      <SectionHeading index={s.index} label={s.label} title={s.title} intro={s.intro} />

      {/* BENTO grid */}
      <div className="mt-16 grid gap-3 sm:mt-20 md:grid-cols-2 lg:grid-cols-6 lg:auto-rows-[minmax(19rem,auto)]">
        <PhotoCard
          large
          card={s.dashi}
          src={photos.dashi}
          alt="A bowl of clear dashi broth"
          className="md:col-span-2 lg:col-span-4 lg:row-span-2 lg:min-h-[40rem]"
        />
        <PhotoCard card={s.fish} src={photos.fish} alt="Whole fish plated with seasonal vegetables" className="lg:col-span-2" />

        {/* Text-only cell: typographic contrast instead of an icon. */}
        <article className="flex min-h-[19rem] flex-col justify-between border border-line bg-ink-2 p-6 sm:p-8 lg:col-span-2">
          <div className="flex items-start justify-between gap-6">
            <p className="eyebrow text-brass/90">{s.season.kicker}</p>
            <span className="font-[family-name:var(--font-jp)] text-5xl leading-none text-paper/15 [writing-mode:vertical-rl]" aria-hidden>
              神無月
            </span>
          </div>
          <div>
            <h3 className="display text-3xl">{s.season.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-paper-dim">{s.season.body}</p>
          </div>
        </article>

        <PhotoCard card={s.counter} src={photos.counter} alt="Hinoki wood counter with stools" className="lg:col-span-2" />
        <PhotoCard card={s.sake} src={photos.sake} alt="Sake bottles and small cups on a table" className="lg:col-span-2" />
        <PhotoCard
          card={s.chef}
          src={photos.chefSushi}
          alt="Chef shaping nigiri by hand"
          className="md:col-span-2 lg:col-span-2"
        />
      </div>
    </section>
  );
}
