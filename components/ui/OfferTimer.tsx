"use client";
import React from "react";
import { Timer } from "lucide-react";

type OfferTimerProps = {
  startDate: string; // e.g., "Nov 05, 2025"
  timeStart?: string; // e.g., "7:00 PM"
  totalSeats: number;
  reservedSeats: number;
};

function parseTime12h(
  time: string | undefined,
): { hours: number; minutes: number } | null {
  if (!time) return null;
  const match = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const suffix = match[3].toUpperCase();
  if (suffix === "PM" && hours < 12) hours += 12;
  if (suffix === "AM" && hours === 12) hours = 0;
  return { hours, minutes };
}

function buildTargetDate(
  startDate: string,
  time: string | undefined,
): Date | null {
  // Attempt to combine date and time into a single local Date
  const base = new Date(startDate);
  if (isNaN(base.getTime())) return null;
  const t = parseTime12h(time);
  if (t) {
    const withTime = new Date(base);
    withTime.setHours(t.hours, t.minutes, 0, 0);
    return withTime;
  }
  return base;
}

function formatDuration(ms: number): string {
  if (ms <= 0) return "0m";
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  parts.push(`${minutes}m`);
  return parts.join(" ");
}

export default function OfferTimer({
  startDate,
  timeStart,
  totalSeats,
  reservedSeats,
}: OfferTimerProps) {
  const [now, setNow] = React.useState<Date | null>(null);

  React.useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000 * 30); // update every 30s
    return () => clearInterval(id);
  }, []);

  const seatsLeft = totalSeats - reservedSeats;
  const target = React.useMemo(
    () => buildTargetDate(startDate, timeStart),
    [startDate, timeStart],
  );

  const shouldShow = React.useMemo(() => {
    if (seatsLeft <= 0) return false;
    if (!target) return false;
    if (!now) return false; // avoid SSR/client mismatch by not rendering until mounted
    return now.getTime() < target.getTime();
  }, [seatsLeft, target, now]);

  if (!shouldShow || !target || !now) return null;

  const remaining = target.getTime() - now.getTime();
  const text = `Starts in ${formatDuration(remaining)}`;

  return (
    <div className="inline-flex items-center gap-1 text-[11px] text-red-700">
      <Timer size={12} className="text-red-600" />
      {text}
    </div>
  );
}
