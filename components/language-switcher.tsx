"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Check, ChevronDown } from "lucide-react";
import { locales, localeShort, useI18n, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/** Compact dropdown for the desktop header. */
export function LanguageDropdown({ className }: { className?: string }) {
  const { locale, setLocale, t } = useI18n();
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger
        aria-label={t.lang.label}
        className={cn(
          "flex h-9 items-center gap-1.5 px-2 text-[0.75rem] tracking-[0.14em] text-paper-dim transition-colors hover:text-paper data-[state=open]:text-paper",
          className,
        )}
      >
        {localeShort[locale]}
        <ChevronDown className="size-3.5" strokeWidth={1.5} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-[60] min-w-44 border border-line bg-ink-2 p-1 shadow-xl shadow-black/50 data-[state=open]:animate-overlay-in"
        >
          <DropdownMenu.RadioGroup value={locale} onValueChange={(v) => setLocale(v as Locale)}>
            {locales.map((l) => (
              <DropdownMenu.RadioItem
                key={l}
                value={l}
                className="flex cursor-pointer items-center justify-between gap-6 px-3 py-2.5 text-sm text-paper-dim outline-none data-[highlighted]:bg-paper/[0.06] data-[state=checked]:text-paper"
              >
                <span>
                  <span className="mr-3 inline-block w-11 text-[0.6875rem] tracking-[0.14em] text-paper-mute">
                    {localeShort[l]}
                  </span>
                  {t.lang[l]}
                </span>
                <DropdownMenu.ItemIndicator>
                  <Check className="size-3.5 text-brass" strokeWidth={1.5} />
                </DropdownMenu.ItemIndicator>
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

/** Segmented control — used in the mobile sheet and the footer. */
export function LanguageSegment({ className }: { className?: string }) {
  const { locale, setLocale, t } = useI18n();
  return (
    <div role="radiogroup" aria-label={t.lang.label} className={cn("inline-flex border border-line", className)}>
      {locales.map((l) => (
        <button
          key={l}
          type="button"
          role="radio"
          aria-checked={locale === l}
          lang={l}
          title={t.lang[l]}
          onClick={() => setLocale(l)}
          className={cn(
            "h-9 px-3 text-[0.6875rem] tracking-[0.14em] transition-colors",
            locale === l ? "bg-paper text-ink" : "text-paper-mute hover:text-paper",
          )}
        >
          {localeShort[l]}
        </button>
      ))}
    </div>
  );
}
