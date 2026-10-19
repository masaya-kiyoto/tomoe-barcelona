"use client";

import { useEffect, useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { addDays, isSameDay, startOfDay } from "date-fns";
import { ca, enGB, es, ja } from "date-fns/locale";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { fmt, intlLocale, useI18n, type Locale } from "@/lib/i18n";
import { barcelonaNow } from "@/lib/hours";
import { dinnerSlots, lunchSlots } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./ui/dialog";
import { FieldError, Input, Label, Textarea } from "./ui/field";

const dfLocale: Record<Locale, typeof enGB> = { ca, es, ja, "en-GB": enGB };
const BOOKING_WINDOW_DAYS = 30;
const MIN_NOTICE_MIN = 60;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Details = { name: string; email: string; phone: string; requests: string };
type ErrorKey = "date" | "time" | "name" | "email" | "phone";

const emptyDetails: Details = { name: "", email: "", phone: "", requests: "" };

export function ReservationModal({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { t, locale } = useI18n();
  const r = t.reservation;

  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState<string | undefined>();
  const [details, setDetails] = useState<Details>(emptyDetails);
  const [showErrors, setShowErrors] = useState(false);

  // Reset after the close animation so the dialog doesn't visibly jump.
  useEffect(() => {
    if (open) return;
    const id = setTimeout(() => {
      setStep(0);
      setGuests(2);
      setDate(undefined);
      setTime(undefined);
      setDetails(emptyDetails);
      setShowErrors(false);
    }, 300);
    return () => clearTimeout(id);
  }, [open]);

  const today = startOfDay(new Date());
  const lastDay = addDays(today, BOOKING_WINDOW_DAYS);
  const isSunday = date?.getDay() === 0;

  /** Slots that are bookable for the chosen date (no dinner on Sunday, ≥60 min notice today). */
  const slotDisabled = (slot: string, kind: "lunch" | "dinner") => {
    if (!date) return true;
    if (kind === "dinner" && isSunday) return true;
    if (isSameDay(date, today)) {
      const [h, m] = slot.split(":").map(Number);
      return h * 60 + m < barcelonaNow().minutes + MIN_NOTICE_MIN;
    }
    return false;
  };

  // Drop a selected time that became unavailable after changing the date.
  useEffect(() => {
    if (!time) return;
    const kind = (lunchSlots as readonly string[]).includes(time) ? "lunch" : "dinner";
    if (slotDisabled(time, kind)) setTime(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const errors = useMemo(() => {
    const e: Partial<Record<ErrorKey, string>> = {};
    if (!date) e.date = r.errors.date;
    if (!time) e.time = r.errors.time;
    if (!details.name.trim()) e.name = r.errors.name;
    if (!EMAIL_RE.test(details.email.trim())) e.email = r.errors.email;
    if (details.phone.replace(/\D/g, "").length < 6) e.phone = r.errors.phone;
    return e;
  }, [date, time, details, r.errors]);

  const err = (k: ErrorKey) => (showErrors ? errors[k] : undefined);

  const guestsLabel =
    locale === "ja" ? `${guests}${r.guest}` : `${guests} ${guests === 1 ? r.guest : r.guestsPlural}`;
  const dateLabel = date
    ? new Intl.DateTimeFormat(intlLocale[locale], { weekday: "long", day: "numeric", month: "long" }).format(date)
    : "";

  const next = () => {
    if (step === 0) {
      if (errors.date || errors.time) return setShowErrors(true);
      setShowErrors(false);
      setStep(1);
    } else if (step === 1) {
      if (errors.name || errors.email || errors.phone) return setShowErrors(true);
      setStep(2);
      toast.success(r.toastTitle, {
        description: fmt(r.toastBody, { guests: guestsLabel, date: dateLabel, time: time ?? "" }),
      });
    }
  };

  const set = (k: keyof Details) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setDetails((d) => ({ ...d, [k]: e.target.value }));

  const renderSlots = (label: string, slots: readonly string[], kind: "lunch" | "dinner") => (
    <div>
      <p className="mb-2.5 text-[0.75rem] text-paper-mute">{label}</p>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-3">
        {slots.map((s) => {
          const disabled = slotDisabled(s, kind);
          return (
            <button
              key={s}
              type="button"
              disabled={disabled}
              aria-pressed={time === s}
              onClick={() => setTime(s)}
              className={cn(
                "h-10 border text-sm tabular-nums transition-colors",
                time === s
                  ? "border-paper bg-paper text-ink"
                  : "border-line text-paper-dim hover:border-paper-dim hover:text-paper",
                "disabled:cursor-not-allowed disabled:border-line disabled:text-paper/20 disabled:line-through disabled:hover:text-paper/20",
              )}
            >
              {s}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent closeLabel={r.done} aria-describedby="reservation-desc" className="max-w-3xl">
        {/* Header + stepper */}
        <div className="shrink-0 border-b border-line px-5 pb-5 pt-6 sm:px-8 sm:pt-7">
          <DialogTitle className="display pr-10 text-2xl sm:text-[1.75rem]">{r.title}</DialogTitle>
          <DialogDescription id="reservation-desc" className="sr-only">
            {r.steps.join(" → ")}
          </DialogDescription>
          <ol className="mt-5 grid grid-cols-3 gap-2">
            {r.steps.map((label, i) => (
              <li key={label} aria-current={i === step ? "step" : undefined}>
                <div className={cn("h-px transition-colors duration-500", i <= step ? "bg-paper" : "bg-line-strong")} />
                <p className={cn("mt-2.5 text-[0.6875rem] tracking-[0.08em] sm:text-[0.75rem]", i <= step ? "text-paper" : "text-paper-mute")}>
                  <span className="mr-1.5 tabular-nums">0{i + 1}</span>
                  <span className={cn(i !== step && "hidden sm:inline")}>{label}</span>
                </p>
              </li>
            ))}
          </ol>
        </div>

        {/* Body */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-8 sm:py-8">
          {step === 0 && (
            <div className="grid gap-8 md:grid-cols-[auto_1fr] md:gap-10">
              <div>
                <Label>{r.date}</Label>
                <div className="-mx-1 flex justify-center border border-line p-2 sm:p-3 md:justify-start">
                  <DayPicker
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    locale={dfLocale[locale]}
                    weekStartsOn={1}
                    startMonth={today}
                    endMonth={lastDay}
                    disabled={[{ before: today }, { after: lastDay }, { dayOfWeek: [1] }]}
                    showOutsideDays={false}
                  />
                </div>
                <p className="mt-2 text-[0.75rem] text-paper-mute">{r.closedMonday}</p>
                <FieldError id="err-date">{err("date")}</FieldError>
              </div>

              <div className="space-y-7">
                <div>
                  <Label>{r.guests}</Label>
                  <div role="radiogroup" aria-label={r.guests} className="grid grid-cols-6 border border-line">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <button
                        key={n}
                        type="button"
                        role="radio"
                        aria-checked={guests === n}
                        onClick={() => setGuests(n)}
                        className={cn(
                          "h-11 border-r border-line text-sm tabular-nums transition-colors last:border-r-0",
                          guests === n ? "bg-paper text-ink" : "text-paper-dim hover:text-paper",
                        )}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>{r.time}</Label>
                  {!date ? (
                    <p className="border border-dashed border-line px-4 py-6 text-sm text-paper-mute">{r.pickDate}</p>
                  ) : (
                    <div className="space-y-5">
                      {renderSlots(r.lunch, lunchSlots, "lunch")}
                      {renderSlots(r.dinner, dinnerSlots, "dinner")}
                      {isSunday && <p className="text-[0.75rem] text-paper-mute">{r.noDinner}</p>}
                    </div>
                  )}
                  <FieldError id="err-time">{date ? err("time") : undefined}</FieldError>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <p className="mb-8 border-l border-brass pl-4 text-sm text-paper-dim">
                {fmt(r.summary, { guests: guestsLabel, date: dateLabel, time: time ?? "" })}
              </p>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label htmlFor="res-name">{r.name}</Label>
                  <Input
                    id="res-name"
                    autoComplete="name"
                    value={details.name}
                    onChange={set("name")}
                    aria-invalid={!!err("name")}
                    aria-describedby={err("name") ? "err-name" : undefined}
                  />
                  <FieldError id="err-name">{err("name")}</FieldError>
                </div>
                <div>
                  <Label htmlFor="res-email">{r.email}</Label>
                  <Input
                    id="res-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={details.email}
                    onChange={set("email")}
                    aria-invalid={!!err("email")}
                    aria-describedby={err("email") ? "err-email" : undefined}
                  />
                  <FieldError id="err-email">{err("email")}</FieldError>
                </div>
                <div>
                  <Label htmlFor="res-phone">{r.phone}</Label>
                  <Input
                    id="res-phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="+34"
                    value={details.phone}
                    onChange={set("phone")}
                    aria-invalid={!!err("phone")}
                    aria-describedby={err("phone") ? "err-phone" : undefined}
                  />
                  <FieldError id="err-phone">{err("phone")}</FieldError>
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="res-requests">
                    {r.requests} <span className="normal-case tracking-normal">({r.optional})</span>
                  </Label>
                  <Textarea
                    id="res-requests"
                    value={details.requests}
                    onChange={set("requests")}
                    placeholder={r.requestsPlaceholder}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="py-4 text-center sm:py-8">
              <span className="mx-auto flex size-14 items-center justify-center rounded-full border border-paper/40">
                <Check className="size-6" strokeWidth={1.25} />
              </span>
              <h3 className="display mt-6 text-3xl">{r.successTitle}</h3>
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-paper-dim">{r.successBody}</p>
              <dl className="mx-auto mt-8 grid max-w-md grid-cols-3 divide-x divide-line border-y border-line text-left">
                {[
                  [r.guests, guestsLabel],
                  [r.date, date ? new Intl.DateTimeFormat(intlLocale[locale], { day: "numeric", month: "short" }).format(date) : ""],
                  [r.time, time],
                ].map(([k, v]) => (
                  <div key={k} className="px-4 py-4">
                    <dt className="eyebrow">{k}</dt>
                    <dd className="mt-1.5 font-[family-name:var(--font-display)] text-lg tabular-nums">{v}</dd>
                  </div>
                ))}
              </dl>
              {details.name && <p className="mt-6 text-sm text-paper-mute">{details.name} · {details.email}</p>}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-line px-5 py-4 sm:px-8">
          <div className="flex items-center justify-between gap-3">
            {step === 1 ? (
              <Button variant="ghost" size="md" className="px-0" onClick={() => { setShowErrors(false); setStep(0); }}>
                ← {r.back}
              </Button>
            ) : (
              <span />
            )}
            {step < 2 ? (
              <Button size="md" onClick={next} className="min-w-36">
                {step === 0 ? r.next : r.submit}
              </Button>
            ) : (
              <Button size="md" onClick={() => onOpenChange(false)} className="min-w-36">
                {r.done}
              </Button>
            )}
          </div>
          <p className="mt-4 text-center text-[0.6875rem] italic text-paper-mute">{r.demo}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
