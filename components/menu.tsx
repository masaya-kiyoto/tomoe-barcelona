"use client";

import Image from "next/image";
import { useI18n } from "@/lib/i18n";
import { menu, type MenuTag } from "@/lib/site";
import { SectionHeading } from "./section-heading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

const dietTags: MenuTag[] = ["vegetarian", "vegetarianOption", "glutenFree"];

export function Menu() {
  const { t } = useI18n();
  const m = t.menu;

  return (
    <section id="menu" className="border-t border-line bg-ink-2/50">
      <div className="mx-auto max-w-[90rem] px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40">
        <SectionHeading index={m.index} label={m.label} title={m.title} intro={m.intro} />

        <Tabs defaultValue="omakase" className="mt-16 sm:mt-20">
          <TabsList aria-label={m.title}>
            {menu.map((c) => (
              <TabsTrigger key={c.id} value={c.id}>
                {m.tabs[c.id]}
              </TabsTrigger>
            ))}
          </TabsList>

          {menu.map((c) => (
            <TabsContent key={c.id} value={c.id} className="mt-10 sm:mt-14">
              <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
                <figure className="lg:col-span-5">
                  <div className="relative aspect-[4/3] overflow-hidden bg-ink-3 lg:sticky lg:top-28 lg:aspect-[4/5]">
                    <Image
                      src={c.photo}
                      alt={m.tabs[c.id]}
                      fill
                      sizes="(min-width:1024px) 40vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="mt-4 text-[0.8125rem] leading-relaxed text-paper-mute">{m.notes[c.id]}</figcaption>
                </figure>

                <ul className="divide-y divide-line border-y border-line lg:col-span-7">
                  {c.items.map((item) => {
                    const copy = m.items[item.id as keyof typeof m.items];
                    const diet = item.tags.filter((tg) => dietTags.includes(tg));
                    const allergens = item.tags.filter((tg) => !dietTags.includes(tg));
                    return (
                      <li key={item.id} className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-3 py-7 sm:py-8">
                        <div>
                          <h3 className="display text-[1.375rem] sm:text-2xl">{copy.name}</h3>
                          <p lang="ja" className="mt-1 font-[family-name:var(--font-jp)] text-[0.8125rem] text-paper-mute">
                            {item.jp}
                          </p>
                        </div>
                        <p className="pt-1 text-right font-[family-name:var(--font-display)] text-lg tabular-nums text-brass sm:text-xl">
                          {item.price}
                        </p>
                        <p className="col-span-2 max-w-xl text-sm leading-relaxed text-paper-dim sm:col-span-1">{copy.desc}</p>

                        {(diet.length > 0 || allergens.length > 0) && (
                          <div className="col-span-2 flex flex-wrap items-center gap-x-4 gap-y-2">
                            {diet.map((tg) => (
                              <span
                                key={tg}
                                className="border border-paper/30 px-2 py-0.5 text-[0.6875rem] tracking-[0.08em] text-paper"
                              >
                                {m.tags[tg]}
                              </span>
                            ))}
                            {allergens.length > 0 && (
                              <span className="text-[0.75rem] text-paper-mute">
                                <span className="text-paper-dim">{m.allergenLabel}: </span>
                                {allergens.map((tg) => m.tags[tg]).join(" · ")}
                              </span>
                            )}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <p className="mt-12 max-w-2xl text-[0.75rem] leading-relaxed text-paper-mute lg:ml-auto lg:w-7/12">{m.allergenNote}</p>
      </div>
    </section>
  );
}
