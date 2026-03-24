"use client";
import React from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/cn";

type DateRange = {
  from: string | null;
  to: string | null;
};

type DateRangePickerProps = {
  value: DateRange;
  onChange: (next: DateRange) => void;
  label?: string;
  className?: string;
  placeholder?: string;
  min?: string;
  max?: string;
};

function parse(dateStr: string | null): Date | null {
  if (!dateStr) return null;
  const [y, m, d] = dateStr.split("-").map((n) => parseInt(n, 10));
  if (!y || !m || !d) return null;
  const dt = new Date(Date.UTC(y, m - 1, d));
  if (Number.isNaN(dt.getTime())) return null;
  return dt;
}

function format(dt: Date): string {
  const y = dt.getUTCFullYear();
  const m = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const d = String(dt.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function isSameDay(a: Date, b: Date) {
  return a.getUTCFullYear() === b.getUTCFullYear() && a.getUTCMonth() === b.getUTCMonth() && a.getUTCDate() === b.getUTCDate();
}

function addMonths(dt: Date, delta: number) {
  const y = dt.getUTCFullYear();
  const m = dt.getUTCMonth();
  const d = dt.getUTCDate();
  const next = new Date(Date.UTC(y, m + delta, 1));
  const lastDayNextMonth = new Date(Date.UTC(next.getUTCFullYear(), next.getUTCMonth() + 1, 0)).getUTCDate();
  const day = Math.min(d, lastDayNextMonth);
  return new Date(Date.UTC(next.getUTCFullYear(), next.getUTCMonth(), day));
}

function getMonthMatrix(view: Date) {
  const firstOfMonth = new Date(Date.UTC(view.getUTCFullYear(), view.getUTCMonth(), 1));
  const startWeekday = (firstOfMonth.getUTCDay() + 6) % 7; // make Monday=0
  const startDate = new Date(Date.UTC(view.getUTCFullYear(), view.getUTCMonth(), 1 - startWeekday));
  const weeks: Array<Array<Date>> = [];
  let current = startDate;
  for (let w = 0; w < 6; w++) {
    const row: Array<Date> = [];
    for (let d = 0; d < 7; d++) {
      row.push(new Date(current));
      current = new Date(Date.UTC(current.getUTCFullYear(), current.getUTCMonth(), current.getUTCDate() + 1));
    }
    weeks.push(row);
  }
  return weeks;
}

export default function DateRangePicker({ value, onChange, label, className, placeholder = "Select date range", min, max }: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const fromDate = parse(value.from);
  const toDate = parse(value.to);
  const [view, setView] = React.useState<Date>(() => fromDate || new Date());

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const minDate = parse(min || null);
  const maxDate = parse(max || null);
  const currentYear = new Date().getUTCFullYear();
  const now = new Date();
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const effectiveMaxDate = maxDate ?? today;
  const yearStart = (minDate ? minDate.getUTCFullYear() : currentYear - 100);
  const yearEnd = (effectiveMaxDate ? effectiveMaxDate.getUTCFullYear() : currentYear);
  const years: number[] = React.useMemo(() => {
    const ys: number[] = [];
    for (let y = yearStart; y <= yearEnd; y++) ys.push(y);
    return ys;
  }, [yearStart, yearEnd]);
  const monthNames = React.useMemo(() => [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ], []);

  function inRange(date: Date, start: Date | null, end: Date | null) {
    if (!start || !end) return false;
    return date >= start && date <= end;
  }

  function isDisabled(date: Date) {
    if (minDate && date < minDate) return true;
    if (effectiveMaxDate && date > effectiveMaxDate) return true;
    return false;
  }

  function handleSelect(date: Date) {
    if (!fromDate || (fromDate && toDate)) {
      onChange({ from: format(date), to: null });
      setView(date);
      return;
    }
    if (fromDate && !toDate) {
      if (date < fromDate) {
        onChange({ from: format(date), to: format(fromDate) });
      } else if (isSameDay(date, fromDate)) {
        onChange({ from: format(date), to: format(date) });
      } else {
        onChange({ from: format(fromDate), to: format(date) });
      }
      return;
    }
  }

  const weeks = getMonthMatrix(new Date(Date.UTC(view.getUTCFullYear(), view.getUTCMonth(), 1)));

  const displayText = fromDate && toDate
    ? `${format(fromDate)} — ${format(toDate)}`
    : fromDate
      ? `${format(fromDate)} — …`
      : placeholder;

  const monthLabel = new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric", timeZone: "UTC" }).format(view);
  const selectedMonth = view.getUTCMonth();
  const selectedYear = view.getUTCFullYear();

  return (
    <div className={cn("relative w-full", className)} ref={containerRef}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-[color:var(--foreground)]">{label}</label>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "h-11 w-full px-3 rounded-lg bg-white border text-left text-[color:var(--foreground)]",
          "border-[color:var(--color-neutral-200)] hover:border-[color:var(--color-primary-300)] focus:border-[color:var(--color-primary-400)]",
          "shadow-xs focus:shadow-sm transition-all inline-flex items-center justify-between gap-2",
          open && "bg-[color:var(--color-primary-50)] border-[color:var(--color-primary-400)]"
        )}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className={cn("truncate", !fromDate && "text-[color:var(--color-neutral-400)]")}>{displayText}</span>
        <CalendarIcon size={18} className="text-[color:var(--color-neutral-500)]" />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-2 z-10 w-full sm:w-[320px] rounded-xl border bg-white shadow-lg border-[color:var(--color-neutral-200)]">
            <div className="p-3 border-b border-[color:var(--color-neutral-200)] flex items-center justify-between gap-2">
              <button
                type="button"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-[color:var(--color-neutral-100)] text-[color:var(--color-neutral-700)]"
                onClick={() => setView((v) => addMonths(v, -1))}
                aria-label="Previous month"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="flex-1 flex items-center justify-center gap-2 min-w-0">
                <select
                  aria-label="Select month"
                  className="h-8 px-2 rounded-md border border-[color:var(--color-neutral-200)] bg-white text-sm text-[color:var(--foreground)] focus:border-[color:var(--color-primary-400)]"
                  value={selectedMonth}
                  onChange={(e) => {
                    const m = parseInt(e.target.value, 10);
                    setView(new Date(Date.UTC(selectedYear, m, 1)));
                  }}
                >
                  {monthNames.map((m, idx) => (
                    <option key={m} value={idx}>{m}</option>
                  ))}
                </select>
                <select
                  aria-label="Select year"
                  className="h-8 px-2 rounded-md border border-[color:var(--color-neutral-200)] bg-white text-sm text-[color:var(--foreground)] focus:border-[color:var(--color-primary-400)] scroll-elegant"
                  value={selectedYear}
                  onChange={(e) => {
                    const y = parseInt(e.target.value, 10);
                    setView(new Date(Date.UTC(y, selectedMonth, 1)));
                  }}
                >
                  {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-[color:var(--color-neutral-100)] text-[color:var(--color-neutral-700)]"
                onClick={() => setView((v) => addMonths(v, 1))}
                aria-label="Next month"
              >
                <ChevronRight size={18} />
              </button>
            </div>
            <div className="p-3">
              <div className="grid grid-cols-7 gap-1 text-[11px] text-[color:var(--color-neutral-500)] mb-1">
                {[
                  "Mon",
                  "Tue",
                  "Wed",
                  "Thu",
                  "Fri",
                  "Sat",
                  "Sun",
                ].map((d) => (
                  <div key={d} className="h-7 flex items-center justify-center select-none">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {weeks.flatMap((row, wi) =>
                  row.map((date, di) => {
                    const inMonth = date.getUTCMonth() === view.getUTCMonth();
                    const isStart = fromDate ? isSameDay(date, fromDate) : false;
                    const isEnd = toDate ? isSameDay(date, toDate) : false;
                    const within = inRange(date, fromDate, toDate);
                    const disabled = isDisabled(date);
                    const isToday = isSameDay(date, today);
                    const base = "h-9 rounded-md text-sm flex items-center justify-center select-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary-300)]";
                    const color = disabled
                      ? "text-[color:var(--color-neutral-400)] opacity-60 cursor-not-allowed"
                      : inMonth
                        ? "text-[color:var(--foreground)] hover:bg-[color:var(--color-neutral-100)]"
                        : "text-[color:var(--color-neutral-400)]";
                    const selected = (isStart || isEnd) && !disabled
                      ? "bg-[color:var(--color-primary-600)] text-white hover:bg-[color:var(--color-primary-600)] font-medium"
                      : within
                        ? "bg-[color:var(--color-primary-50)] text-[color:var(--color-primary-700)]"
                        : "";
                    const todayClass = isToday && !isStart && !isEnd && !within && !disabled ? "ring-1 ring-[color:var(--color-primary-300)]" : "";
                    return (
                      <button
                        key={`${wi}-${di}`}
                        type="button"
                        disabled={disabled}
                        onClick={() => handleSelect(date)}
                        className={cn(base, color, selected, todayClass)}
                        aria-pressed={isStart || isEnd || within}
                      >
                        {date.getUTCDate()}
                      </button>
                    );
                  })
                )}
              </div>
              <div className="flex items-center justify-between gap-2 mt-3">
                <button
                  type="button"
                  className="text-xs text-[color:var(--color-neutral-700)] hover:underline"
                  onClick={() => onChange({ from: null, to: null })}
                >
                  Clear
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="text-xs px-3 py-1.5 rounded-md border border-[color:var(--color-neutral-200)] hover:bg-[color:var(--color-neutral-100)]"
                    onClick={() => setOpen(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
        </div>
      )}
    </div>
  );
}


