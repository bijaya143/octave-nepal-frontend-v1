import { DurationUnit } from "@/lib/services/admin/types";

const UNIT_LABEL: Record<DurationUnit, string> = {
  [DurationUnit.MINUTE]: "min",
  [DurationUnit.HOUR]: "hr",
  [DurationUnit.DAY]: "day",
  [DurationUnit.WEEK]: "week",
  [DurationUnit.MONTH]: "month",
  [DurationUnit.YEAR]: "year",
};

/** Strips trailing decimal zeros (e.g. 2.00 → "2", 2.50 → "2.5"). Coerces string API values. */
export function formatDurationValue(val: number | string): string {
  const n = Number(val);
  if (!Number.isFinite(n)) return String(val);
  return String(parseFloat(n.toFixed(2)));
}

/** Compact label: "2 hrs", "1 hr". */
export function formatDuration(
  val: number | string,
  unit: DurationUnit | string,
): string {
  const label =
    UNIT_LABEL[unit as DurationUnit] ??
    String(unit).toLowerCase();
  const displayVal = formatDurationValue(val);
  const num = Number(displayVal);
  return `${displayVal} ${label}${num !== 1 ? "s" : ""}`;
}

/** Full unit name: "2 hour(s)". */
export function formatDurationWithUnit(
  val: number | string,
  unit: string,
): string {
  const displayVal = formatDurationValue(val);
  return `${displayVal} ${unit.toLowerCase()}(s)`;
}
