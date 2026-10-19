"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import ca from "@/locales/ca.json";
import es from "@/locales/es.json";
import ja from "@/locales/ja.json";
import enGB from "@/locales/en-GB.json";

export type Dictionary = typeof enGB;
export const locales = ["ca", "es", "ja", "en-GB"] as const;
export type Locale = (typeof locales)[number];

// Typed as Dictionary so a missing key in any locale fails the build.
const dictionaries: Record<Locale, Dictionary> = { ca, es, ja, "en-GB": enGB };

export const localeShort: Record<Locale, string> = { ca: "CA", es: "ES", ja: "JA", "en-GB": "EN-GB" };

type I18nValue = {
  locale: Locale;
  t: Dictionary;
  setLocale: (l: Locale) => void;
};

const I18nContext = createContext<I18nValue | null>(null);
const STORAGE_KEY = "tomoe-locale";

function detectLocale(): Locale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (saved && locales.includes(saved)) return saved;
  } catch {
    /* storage unavailable */
  }
  const nav = (typeof navigator !== "undefined" ? navigator.language : "").toLowerCase();
  if (nav.startsWith("ca")) return "ca";
  if (nav.startsWith("es")) return "es";
  if (nav.startsWith("ja")) return "ja";
  return "en-GB";
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en-GB");

  useEffect(() => {
    setLocaleState(detectLocale());
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = dictionaries[locale].meta.title;
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(() => ({ locale, t: dictionaries[locale], setLocale }), [locale, setLocale]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}

/** Replace {placeholders} in a dictionary string. */
export function fmt(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
}

/** Intl locale used for dates — Catalan/Spanish/Japanese/British English. */
export const intlLocale: Record<Locale, string> = { ca: "ca-ES", es: "es-ES", ja: "ja-JP", "en-GB": "en-GB" };
