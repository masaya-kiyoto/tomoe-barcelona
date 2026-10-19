# Tomoe 巴 — Japanese Restaurant Website, Barcelona

**Live demo → https://tomoe-barcelona.vercel.app**

A multilingual website for a fine-dining Japanese restaurant in Barcelona's Eixample district, with a working reservation flow. Built as a portfolio project by **Masaya Kiyoto**.

> Tomoe is a fictional restaurant. The address, phone number and dishes are for illustration only, and no real booking is created.

![Tomoe — home page](docs/hero.png)

---

## For restaurants and business owners

What this site does for a restaurant like yours:

- **Speaks to every guest in their language.** Catalan, Spanish, Japanese and English, switched instantly with no page reload. The site picks the visitor's browser language on the first visit.
- **Takes reservations directly.** Guests choose party size, date and time, then leave their details and any allergies, in three short steps. Closed days and fully past time slots are greyed out automatically.
- **Shows whether you are open right now.** Opening hours are calculated in Barcelona time, so a tourist checking from Tokyo or London sees the correct status.
- **Lists allergens properly.** Every dish shows vegetarian / gluten-free options and the allergens it contains, following EU Regulation 1169/2011.
- **Helps people find you.** Address, map, nearest metro station, dress code and a one-tap "Open in Google Maps" button.
- **Works on any phone.** Designed mobile-first and tested at phone, tablet and desktop widths.

| Reservation | Menu | Mobile |
|---|---|---|
| ![Reservation](docs/reservation.png) | ![Menu](docs/menu.png) | ![Mobile](docs/mobile.png) |

**Design approach.** High-end restaurant sites (Masa in New York, Gonpachi in Tokyo) let photography and typography carry the page. Tomoe follows that: a charcoal palette, generous whitespace, real food and interior photos instead of stock icons, and copy that says plainly where the restaurant is and what it serves.

---

## For engineers

### Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript (strict) |
| Styling | Tailwind CSS 4 with design tokens in `app/globals.css` |
| UI | shadcn/ui-style components built on Radix (Dialog, Tabs, Dropdown Menu) |
| Other | react-day-picker, date-fns, sonner (toasts), lucide-react |
| Hosting | Vercel (static prerender) |

### Implementation notes

- **Type-safe i18n without a library.** All four dictionaries are typed against `locales/en-GB.json`, so a missing key in any language fails `npm run build`. Locale is stored in `localStorage` and falls back to `navigator.language`.
- **Time-zone-correct business logic.** `lib/hours.ts` derives the current weekday and time in `Europe/Madrid` via `Intl.DateTimeFormat`, independent of the visitor's clock. Clock-dependent UI renders only after mount to avoid hydration mismatches.
- **Reservation rules in one place.** `lib/site.ts` holds the schedule and slots: closed Mondays, Sunday lunch only, a 30-day booking window and 60 minutes' notice for same-day slots. The modal disables invalid dates and times and validates each step with inline, accessible error messages (`aria-invalid`, `role="alert"`).
- **Accessibility.** Radix primitives handle focus trapping and keyboard navigation; the language switcher and party-size picker are proper radio groups; motion respects `prefers-reduced-motion`.
- **Data separated from presentation.** Menu items, prices, allergen tags and photos live in `lib/site.ts`; components only render them.

### Project structure

```
app/            layout, page, global styles and tokens
components/     header, hero, story (bento grid), menu, reservation-modal, map, footer
components/ui/  button, dialog, tabs, form fields, toaster
lib/            i18n context, opening-hours logic, site data
locales/        ca.json · es.json · ja.json · en-GB.json
```

### Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

Open `http://localhost:3000` rather than the network IP if buttons don't respond in dev mode.

---

## 日本語

バルセロナ・アシャンプラ地区の高級日本料理店を想定した、4言語（カタルーニャ語・スペイン語・日本語・英語）対応のWebサイトです。予約フォーム、バルセロナ時間で表示する営業状態、EU基準のアレルゲン表示を備えています。ポートフォリオ用のデモで、店舗は架空です。

---

**Masaya Kiyoto** · Full-stack engineer · Barcelona
GitHub [@masaya-kiyoto](https://github.com/masaya-kiyoto)

Photography: [Unsplash](https://unsplash.com) (Unsplash License).
