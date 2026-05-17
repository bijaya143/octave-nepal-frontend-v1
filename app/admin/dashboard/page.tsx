"use client";

import React, { useMemo, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  Wallet,
  BookCheck,
  GraduationCap,
  School,
  TrendingUp,
  Star,
  RefreshCw,
  ArrowUpRight,
  Activity,
  AlertCircle,
  CalendarDays,
  X,
  Lightbulb,
  PieChart,
  TrendingDown,
  ChevronRight,
  Target,
  CircleCheck,
  Sparkle,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  useAdminDashboard,
  type DateRangeFilter,
} from "@/lib/hooks/useAdminDashboard";

import { cn } from "@/lib/cn";

/* ── Helpers ── */
function formatCurrency(amount: number) {
  if (amount >= 100000) return `Rs. ${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `Rs. ${(amount / 1000).toFixed(1)}K`;
  return `Rs. ${amount.toLocaleString()}`;
}
function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
function toISO(d: Date) {
  return d.toISOString().split("T")[0];
}
function statusBadge(status: string) {
  const map: Record<string, { label: string; cls: string }> = {
    ACTIVE: {
      label: "Active",
      cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    COMPLETED: {
      label: "Completed",
      cls: "bg-blue-50 text-blue-700 border-blue-200",
    },
    CANCELLED: {
      label: "Cancelled",
      cls: "bg-red-50 text-red-700 border-red-200",
    },
    PAID: {
      label: "Paid",
      cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    PENDING: {
      label: "Pending",
      cls: "bg-amber-50 text-amber-700 border-amber-200",
    },
    FAILED: { label: "Failed", cls: "bg-red-50 text-red-700 border-red-200" },
    REFUNDED: {
      label: "Refunded",
      cls: "bg-purple-50 text-purple-700 border-purple-200",
    },
  };
  const cfg = map[status] ?? {
    label: status,
    cls: "bg-neutral-50 text-neutral-700 border-neutral-200",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        cfg.cls,
      )}
    >
      {cfg.label}
    </span>
  );
}

/* ── Preset ranges ── */
type PresetKey = "today" | "7d" | "30d" | "90d" | "this_month" | "all";
const PRESETS: { key: PresetKey; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "7d", label: "Last 7 Days" },
  { key: "this_month", label: "This Month" },
  { key: "30d", label: "Last 30 Days" },
  { key: "90d", label: "Last 90 Days" },
  { key: "all", label: "All Time" },
];
function presetToRange(key: PresetKey): DateRangeFilter {
  const now = new Date();
  const today = toISO(now);
  if (key === "all") return {};
  if (key === "today") return { startDate: today, endDate: today };
  if (key === "this_month") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    return { startDate: toISO(start), endDate: today };
  }
  const days = key === "7d" ? 7 : key === "30d" ? 30 : 90;
  const start = new Date(now);
  start.setDate(now.getDate() - days + 1);
  return { startDate: toISO(start), endDate: today };
}

/* ── Skeleton ── */
function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-[color:var(--color-neutral-100)]",
        className,
      )}
    />
  );
}

/* ── StatCard ── */
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  gradient: string;
  iconBg: string;
  href?: string;
  loading?: boolean;
}
function StatCard({
  title,
  value,
  subtitle,
  Icon,
  gradient,
  iconBg,
  href,
  loading,
}: StatCardProps) {
  const inner = (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-[color:var(--color-neutral-200)] bg-white p-5 shadow-sm",
        "transition-all duration-300 hover:shadow-md",
        href && "cursor-pointer group",
      )}
    >
      <div
        className={cn(
          "absolute inset-0 opacity-[0.08] pointer-events-none",
          gradient,
        )}
      />
      <div className="relative z-10 flex items-start justify-between">
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-xl",
            iconBg,
          )}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>
        {href && (
          <ArrowUpRight className="h-4 w-4 text-[color:var(--color-neutral-400)] opacity-0 transition-opacity group-hover:opacity-100" />
        )}
      </div>
      <div className="relative z-10 mt-4">
        {loading ? (
          <div className="space-y-2 mt-1">
            <Skeleton className="h-7 w-20" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-24" />
          </div>
        ) : (
          <>
            <p className="text-2xl font-bold text-[color:var(--color-neutral-900)] tabular-nums">
              {value}
            </p>
            <p className="mt-0.5 text-sm text-[color:var(--color-neutral-500)]">
              {title}
            </p>
            {subtitle && (
              <p className="mt-1 text-xs text-[color:var(--color-neutral-400)]">
                {subtitle}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

/* ── ProgressCard ── */
function ProgressCard({
  label,
  value,
  total,
  colorClass,
  loading,
}: {
  label: string;
  value: number;
  total: number;
  colorClass: string;
  loading?: boolean;
}) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-[color:var(--color-neutral-600)]">{label}</span>
        {loading ? (
          <Skeleton className="h-4 w-12" />
        ) : (
          <span className="font-semibold text-[color:var(--color-neutral-800)]">
            {value.toLocaleString()}{" "}
            <span className="font-normal text-[color:var(--color-neutral-400)]">
              ({pct}%)
            </span>
          </span>
        )}
      </div>
      <div className="h-1.5 w-full rounded-full bg-[color:var(--color-neutral-100)] overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700",
            colorClass,
          )}
          style={{ width: loading ? "0%" : `${pct}%` }}
        />
      </div>
    </div>
  );
}

/* ── SectionHeader ── */
function SectionHeader({
  title,
  icon: Icon,
  href,
  linkLabel,
}: {
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[color:var(--color-primary-50)]">
          <Icon className="h-4 w-4 text-[color:var(--color-primary-600)]" />
        </div>
        <h2 className="text-base font-semibold text-[color:var(--color-neutral-800)]">
          {title}
        </h2>
      </div>
      {href && linkLabel && (
        <Link
          href={href}
          className="flex items-center gap-1 text-xs font-medium text-[color:var(--color-primary-600)] hover:text-[color:var(--color-primary-700)] transition-colors"
        >
          {linkLabel}
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      )}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <Activity className="h-8 w-8 text-[color:var(--color-neutral-300)] mb-2" />
      <p className="text-sm text-[color:var(--color-neutral-400)]">{message}</p>
    </div>
  );
}

/* ── Date Range Bar ── */
function DateRangeBar({
  preset,
  onPreset,
  customRange,
  onCustomRange,
  rangeLabel,
}: {
  preset: PresetKey;
  onPreset: (k: PresetKey) => void;
  customRange: { from: string | null; to: string | null };
  onCustomRange: (r: { from: string | null; to: string | null }) => void;
  rangeLabel: string;
}) {
  const isCustomActive = !!customRange.from;
  const [popoverOpen, setPopoverOpen] = React.useState(false);
  const popoverRef = React.useRef<HTMLDivElement>(null);

  // Close popover on outside click
  React.useEffect(() => {
    if (!popoverOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        setPopoverOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [popoverOpen]);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* All chips in one flat row */}
      <div className="flex flex-wrap items-center gap-1.5">
        {PRESETS.map(({ key, label }) => (
          <button
            key={key}
            id={`preset-${key}`}
            onClick={() => {
              onPreset(key);
              onCustomRange({ from: null, to: null });
              setPopoverOpen(false);
            }}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-all",
              preset === key && !isCustomActive
                ? "border-[color:var(--color-primary-600)] bg-[color:var(--color-primary-600)] text-white shadow-sm"
                : "border-[color:var(--color-neutral-200)] bg-white text-[color:var(--color-neutral-600)] hover:border-[color:var(--color-primary-300)] hover:text-[color:var(--color-primary-600)]",
            )}
          >
            {label}
          </button>
        ))}

        {/* Custom chip — inline with others, opens popover on click */}
        <div className="relative" ref={popoverRef}>
          <button
            id="preset-custom"
            onClick={() => setPopoverOpen((o) => !o)}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all",
              isCustomActive
                ? "border-[color:var(--color-primary-600)] bg-[color:var(--color-primary-600)] text-white shadow-sm"
                : "border-[color:var(--color-neutral-200)] bg-white text-[color:var(--color-neutral-600)] hover:border-[color:var(--color-primary-300)] hover:text-[color:var(--color-primary-600)]",
            )}
          >
            <CalendarDays className="h-3 w-3 shrink-0" />
            <span>
              {customRange.from && customRange.to
                ? `${customRange.from} → ${customRange.to}`
                : customRange.from
                  ? `From ${customRange.from}`
                  : "Custom"}
            </span>
            {isCustomActive && (
              <X
                className="h-2.5 w-2.5 shrink-0 opacity-80"
                onClick={(e) => {
                  e.stopPropagation();
                  onCustomRange({ from: null, to: null });
                  onPreset("all");
                  setPopoverOpen(false);
                }}
              />
            )}
          </button>

          {/* Dropdown popover */}
          {popoverOpen && (
            <div className="absolute left-0 top-full mt-1.5 z-20 min-w-[260px] rounded-xl border border-[color:var(--color-neutral-200)] bg-white p-4 shadow-lg animate-in fade-in slide-in-from-bottom-2">
              <p className="mb-2.5 text-xs font-semibold text-[color:var(--color-neutral-700)]">
                Custom date range
              </p>
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="dashboard-custom-start"
                    className="text-xs text-[color:var(--color-neutral-500)]"
                  >
                    From
                  </label>
                  <input
                    id="dashboard-custom-start"
                    type="date"
                    max={toISO(new Date())}
                    value={customRange.from ?? ""}
                    onChange={(e) => {
                      const from = e.target.value || null;
                      onCustomRange({ from, to: customRange.to });
                      if (from) onPreset("all");
                    }}
                    className="h-8 w-full rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-3 text-xs text-[color:var(--color-neutral-700)] focus:border-[color:var(--color-primary-400)] focus:outline-none transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="dashboard-custom-end"
                    className="text-xs text-[color:var(--color-neutral-500)]"
                  >
                    To
                  </label>
                  <input
                    id="dashboard-custom-end"
                    type="date"
                    min={customRange.from ?? undefined}
                    max={toISO(new Date())}
                    value={customRange.to ?? ""}
                    onChange={(e) => {
                      const to = e.target.value || null;
                      onCustomRange({ from: customRange.from, to });
                      if (customRange.from) onPreset("all");
                    }}
                    className="h-8 w-full rounded-lg border border-[color:var(--color-neutral-200)] bg-white px-3 text-xs text-[color:var(--color-neutral-700)] focus:border-[color:var(--color-primary-400)] focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Active range label */}
      <span className="ml-auto text-xs text-[color:var(--color-neutral-400)] italic hidden sm:block">
        {rangeLabel}
      </span>
    </div>
  );
}

/* ── SmartInsights ── */
function SmartInsights({ stats, loading }: { stats: any; loading: boolean }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const completionRate =
    stats.totalEnrollments > 0
      ? (stats.completedEnrollments / stats.totalEnrollments) * 100
      : 0;

  const publishRate =
    stats.totalCourses > 0
      ? (stats.publishedCourses / stats.totalCourses) * 100
      : 0;

  const insights = useMemo(() => {
    const list = [];
    if (completionRate < 30 && stats.totalEnrollments > 10) {
      list.push({
        icon: TrendingDown,
        iconColor: "text-amber-400 bg-amber-500/20",
        title: "Low Completion Rate",
        text: `Currently at ${completionRate.toFixed(1)}%. Automated reminders could boost student engagement.`,
      });
    } else if (completionRate >= 70 && stats.totalEnrollments > 0) {
      list.push({
        icon: TrendingUp,
        iconColor: "text-emerald-400 bg-emerald-500/20",
        title: "High Engagement",
        text: `Excellent completion rate (${completionRate.toFixed(1)}%). Your curriculum is highly effective.`,
      });
    }

    if (publishRate < 50 && stats.totalCourses > 0) {
      list.push({
        icon: BookOpen,
        iconColor: "text-blue-400 bg-blue-500/20",
        title: "Unpublished Content",
        text: `Only ${publishRate.toFixed(0)}% of courses are live. Review drafts to expand your catalog.`,
      });
    }

    if (
      stats.totalRevenue > 0 &&
      stats.totalEnrollments > 0 &&
      stats.totalRevenue / stats.totalEnrollments > 5000
    ) {
      list.push({
        icon: Wallet,
        iconColor: "text-fuchsia-400 bg-fuchsia-500/20",
        title: "Strong Monetization",
        text: "High average revenue per enrollment. Premium offerings are performing exceptionally well.",
      });
    }

    if (list.length === 0) {
      list.push({
        icon: CircleCheck,
        iconColor: "text-teal-400 bg-teal-500/20",
        title: "Platform Healthy",
        text: "All key metrics are stable. Continue monitoring your analytics as you grow.",
      });
    }
    return list;
  }, [completionRate, publishRate, stats]);

  useEffect(() => {
    if (insights.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % insights.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [insights.length]);

  if (loading)
    return (
      <div className="rounded-2xl bg-slate-900 border border-white/10 flex items-center p-3 sm:p-4 h-[64px] sm:h-[72px]">
        <Skeleton className="h-8 w-8 rounded-lg shrink-0 bg-white/10" />
        <Skeleton className="h-4 w-24 ml-3 sm:ml-4 rounded bg-white/10 shrink-0" />
        <Skeleton className="h-4 w-64 ml-4 rounded bg-white/10 flex-1 hidden sm:block" />
      </div>
    );

  const currentInsight = insights[currentIndex];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-slate-900 shadow-md border border-white/10 flex items-center p-3 sm:p-4">
      {/* Decorative blurred blobs */}
      <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-purple-600/30 blur-[40px] pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 h-24 w-24 rounded-full bg-indigo-600/30 blur-[40px] pointer-events-none" />

      <div className="relative z-10 flex items-center gap-3 sm:gap-4 pr-3 sm:pr-4 border-r border-white/10 shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 backdrop-blur-md shadow-inner">
          <Sparkle className="h-4 w-4 text-indigo-300" />
        </div>
        <span className="text-sm font-bold text-white hidden sm:block tracking-wide">
          Octave Intelligence
        </span>
      </div>

      <div className="relative z-10 flex-1 overflow-hidden h-10 flex items-center ml-3 sm:ml-4">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 flex items-center gap-3"
        >
          <div
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 backdrop-blur-md",
              currentInsight.iconColor,
            )}
          >
            <currentInsight.icon className="h-4 w-4" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-0 sm:gap-2 truncate">
            <span className="text-sm font-semibold text-white whitespace-nowrap">
              {currentInsight.title}:
            </span>
            <span className="text-[13px] text-indigo-100/80 truncate">
              {currentInsight.text}
            </span>
          </div>
        </motion.div>
      </div>

      {insights.length > 1 && (
        <div className="relative z-10 flex items-center gap-1.5 ml-4 shrink-0 hidden md:flex">
          {insights.map((_, idx) => (
            <div
              key={idx}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                idx === currentIndex
                  ? "w-4 bg-indigo-400"
                  : "w-1.5 bg-white/20",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── PlatformFunnel ── */
function PlatformFunnel({ stats, loading }: { stats: any; loading: boolean }) {
  if (loading)
    return (
      <div className="flex flex-col gap-6 py-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-6">
            <div className="w-36 shrink-0 flex flex-col items-end gap-1.5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="flex-1 h-10 rounded-r-full" />
          </div>
        ))}
      </div>
    );

  const max = Math.max(stats.totalStudents, stats.totalEnrollments, 1);
  const steps = [
    {
      label: "Registered Students",
      value: stats.totalStudents,
      gradient:
        "bg-gradient-to-r from-blue-500 to-cyan-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]",
    },
    {
      label: "Total Enrollments",
      value: stats.totalEnrollments,
      gradient:
        "bg-gradient-to-r from-indigo-500 to-purple-400 shadow-[0_0_15px_rgba(99,102,241,0.3)]",
    },
    {
      label: "Completed Courses",
      value: stats.completedEnrollments,
      gradient:
        "bg-gradient-to-r from-emerald-400 to-teal-500 shadow-[0_0_15px_rgba(52,211,153,0.3)]",
    },
  ];

  return (
    <div className="flex flex-col gap-6 py-4">
      {steps.map((step, i) => {
        const pct = (step.value / max) * 100;
        return (
          <div key={i} className="group flex items-center gap-6">
            <div className="w-36 shrink-0 text-right">
              <p className="text-sm font-bold text-[color:var(--color-neutral-800)] group-hover:text-indigo-600 transition-colors">
                {step.label}
              </p>
              <p className="text-xs font-medium text-[color:var(--color-neutral-500)]">
                {step.value.toLocaleString()} users
              </p>
            </div>
            <div className="flex-1 h-10 bg-slate-100 rounded-r-full flex items-center shadow-inner overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(pct, 2)}%` }}
                transition={{
                  duration: 1.2,
                  delay: i * 0.2,
                  type: "spring",
                  bounce: 0.2,
                }}
                className={cn(
                  "h-full rounded-r-full relative flex items-center justify-end pr-4",
                  step.gradient,
                )}
              >
                {step.value > 0 && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 + i * 0.2 }}
                    className="text-sm font-extrabold text-white drop-shadow-md"
                  >
                    {Math.round(pct)}%
                  </motion.span>
                )}
              </motion.div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── EngagementDonut ── */
function EngagementDonut({ stats, loading }: { stats: any; loading: boolean }) {
  if (loading)
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-2">
        <div className="relative h-40 w-40 shrink-0">
          <Skeleton className="absolute inset-0 rounded-full" />
          <div className="absolute inset-[14px] bg-white rounded-full flex flex-col items-center justify-center">
            <Skeleton className="h-6 w-12 mb-1" />
            <Skeleton className="h-2 w-8" />
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-3 w-full">
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-28 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
      </div>
    );

  const active = stats.activeEnrollments;
  const completed = stats.completedEnrollments;
  const other = Math.max(0, stats.totalEnrollments - active - completed);
  const total = active + completed + other;

  if (total === 0)
    return <EmptyState message="No enrollment data for donut chart." />;

  const getStrokeDasharray = (val: number, tot: number, rad: number) => {
    const circ = 2 * Math.PI * rad;
    return `${(val / tot) * circ} ${circ}`;
  };

  const getStrokeDashoffset = (prevVals: number, tot: number, rad: number) => {
    const circ = 2 * Math.PI * rad;
    return `${-(prevVals / tot) * circ}`;
  };

  const radius = 38;
  const cx = 50;
  const cy = 50;

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-2">
      <div className="relative h-40 w-40 shrink-0">
        <svg
          viewBox="0 0 100 100"
          className="h-full w-full -rotate-90 transform drop-shadow-xl"
        >
          <defs>
            <linearGradient id="activeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient
              id="completedGrad"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
            <linearGradient id="otherGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Base Track */}
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke="#f1f5f9"
            strokeWidth="14"
          />

          {/* Active */}
          {active > 0 && (
            <motion.circle
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke="url(#activeGrad)"
              strokeWidth="14"
              strokeLinecap="round"
              filter="url(#glow)"
              strokeDasharray={getStrokeDasharray(active, total, radius)}
              strokeDashoffset={getStrokeDashoffset(0, total, radius)}
              initial={{ strokeDasharray: `0 ${2 * Math.PI * radius}` }}
              animate={{
                strokeDasharray: getStrokeDasharray(active, total, radius),
              }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          )}

          {/* Completed */}
          {completed > 0 && (
            <motion.circle
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke="url(#completedGrad)"
              strokeWidth="14"
              strokeLinecap="round"
              filter="url(#glow)"
              strokeDasharray={getStrokeDasharray(completed, total, radius)}
              strokeDashoffset={getStrokeDashoffset(active, total, radius)}
              initial={{ strokeDasharray: `0 ${2 * Math.PI * radius}` }}
              animate={{
                strokeDasharray: getStrokeDasharray(completed, total, radius),
              }}
              transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
            />
          )}

          {/* Other */}
          {other > 0 && (
            <motion.circle
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke="url(#otherGrad)"
              strokeWidth="14"
              strokeLinecap="round"
              filter="url(#glow)"
              strokeDasharray={getStrokeDasharray(other, total, radius)}
              strokeDashoffset={getStrokeDashoffset(
                active + completed,
                total,
                radius,
              )}
              initial={{ strokeDasharray: `0 ${2 * Math.PI * radius}` }}
              animate={{
                strokeDasharray: getStrokeDasharray(other, total, radius),
              }}
              transition={{ duration: 1.5, delay: 0.6, ease: "easeOut" }}
            />
          )}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 backdrop-blur-[2px] rounded-full m-4 shadow-inner">
          <span className="text-2xl font-black text-slate-800 tracking-tight">
            {total}
          </span>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Total
          </span>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3 w-full">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-100 bg-emerald-50/50 shadow-sm">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
          <span className="text-xs font-semibold text-emerald-800">
            Active{" "}
            <span className="opacity-60 font-medium">
              ({Math.round((active / total) * 100)}%)
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-100 bg-blue-50/50 shadow-sm">
          <div className="h-2.5 w-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
          <span className="text-xs font-semibold text-blue-800">
            Completed{" "}
            <span className="opacity-60 font-medium">
              ({Math.round((completed / total) * 100)}%)
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-100 bg-purple-50/50 shadow-sm">
          <div className="h-2.5 w-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
          <span className="text-xs font-semibold text-purple-800">
            Other{" "}
            <span className="opacity-60 font-medium">
              ({Math.round((other / total) * 100)}%)
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── UnifiedActivityTimeline ── */
function UnifiedActivityTimeline({
  enrollments,
  payments,
  loading,
}: {
  enrollments: any[];
  payments: any[];
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[1.1rem] before:h-full before:w-0.5 before:bg-slate-100 pl-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-start justify-between relative pl-6"
          >
            <Skeleton className="absolute -left-[18px] top-1.5 h-8 w-8 rounded-full z-10" />
            <div className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50">
              <div className="flex justify-between items-start mb-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-16 rounded-full" />
              </div>
              <div className="flex justify-between items-center">
                <Skeleton className="h-3 w-48" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const items = [
    ...enrollments.map((e) => ({
      type: "enr",
      date: new Date(e.createdAt),
      data: e,
    })),
    ...payments.map((p) => ({
      type: "pmt",
      date: new Date(p.paidAt),
      data: p,
    })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 8);

  if (items.length === 0)
    return <EmptyState message="No recent activity to show." />;

  return (
    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[1.1rem] before:h-full before:w-0.5 before:bg-gradient-to-b before:from-indigo-500 before:via-purple-400 before:to-transparent pt-2 pl-4 pb-8">
      {items.map((item, i) => {
        const isEnr = item.type === "enr";
        const e = item.data;
        const Icon = isEnr ? GraduationCap : Wallet;

        // Define styles based on type
        const ringColor = isEnr ? "ring-indigo-500/30" : "ring-emerald-500/30";
        const iconBg = isEnr
          ? "bg-gradient-to-br from-indigo-500 to-violet-600"
          : "bg-gradient-to-br from-emerald-400 to-teal-500";
        const borderGlow = isEnr
          ? "hover:border-indigo-300 hover:shadow-[0_4px_20px_rgba(99,102,241,0.15)]"
          : "hover:border-emerald-300 hover:shadow-[0_4px_20px_rgba(16,185,129,0.15)]";

        return (
          <div
            key={`${item.type}-${e.id}`}
            className="relative flex items-start group pl-6"
          >
            {/* Timeline Orb */}
            <div
              className={cn(
                "absolute -left-[18px] top-1.5 flex items-center justify-center w-8 h-8 rounded-full shadow-lg ring-4 z-10 transition-transform duration-300 group-hover:scale-110",
                ringColor,
                iconBg,
              )}
            >
              <Icon className="h-4 w-4 text-white" />
            </div>

            {/* Content Card */}
            <div
              className={cn(
                "w-full p-4 rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300",
                borderGlow,
              )}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-bold text-slate-800 tracking-tight">
                  {isEnr ? e.studentName : e.studentName}
                </span>
                <span className="text-[10px] font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">
                  {formatDate(item.date)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500 leading-relaxed max-w-[75%]">
                  {isEnr ? (
                    <>
                      Enrolled in{" "}
                      <span className="font-semibold text-indigo-600">
                        {e.courseName}
                      </span>
                    </>
                  ) : (
                    <>
                      Paid{" "}
                      <span className="font-semibold text-emerald-600">
                        {formatCurrency(e.amount)}
                      </span>{" "}
                      via {e.paymentMethod.replace(/_/g, " ")}
                    </>
                  )}
                </span>
                <div className="scale-90 origin-right">
                  {statusBadge(e.status)}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Dashboard Page ── */
export default function AdminDashboardPage() {
  const [preset, setPreset] = useState<PresetKey>("all");
  const [customRange, setCustomRange] = useState<{
    from: string | null;
    to: string | null;
  }>({ from: null, to: null });

  // Compute active date filter
  const dateFilter = useMemo<DateRangeFilter>(() => {
    if (customRange.from && customRange.to)
      return { startDate: customRange.from, endDate: customRange.to };
    if (customRange.from) return { startDate: customRange.from };
    return presetToRange(preset);
  }, [preset, customRange]);

  // Human-readable label of the active range
  const rangeLabel = useMemo(() => {
    if (customRange.from && customRange.to)
      return `${customRange.from} → ${customRange.to}`;
    if (customRange.from) return `From ${customRange.from}`;
    if (preset === "all") return "Showing all-time data";
    const p = PRESETS.find((p) => p.key === preset);
    if (!p) return "";
    const range = presetToRange(preset);
    return `${range.startDate} → ${range.endDate}`;
  }, [preset, customRange]);

  const handlePreset = useCallback((k: PresetKey) => setPreset(k), []);
  const handleCustomRange = useCallback(
    (r: { from: string | null; to: string | null }) => setCustomRange(r),
    [],
  );

  const {
    stats,
    recentEnrollments,
    recentPayments,
    isLoading,
    error,
    refresh,
  } = useAdminDashboard(dateFilter);

  const statCards = useMemo<StatCardProps[]>(
    () => [
      {
        title: "Students",
        value: stats.totalStudents.toLocaleString(),
        subtitle: "Registered in period",
        Icon: GraduationCap,
        gradient: "bg-gradient-to-r from-blue-500 to-indigo-500",
        iconBg: "bg-gradient-to-br from-blue-500 to-indigo-600",
        href: "/admin/students",
      },
      {
        title: "Instructors",
        value: stats.totalInstructors.toLocaleString(),
        subtitle: "Platform educators",
        Icon: School,
        gradient: "bg-gradient-to-r from-violet-500 to-purple-600",
        iconBg: "bg-gradient-to-br from-violet-500 to-purple-600",
        href: "/admin/instructors",
      },
      {
        title: "Active Courses",
        value: stats.publishedCourses.toLocaleString(),
        subtitle: `${stats.totalCourses.toLocaleString()} total`,
        Icon: BookOpen,
        gradient: "bg-gradient-to-r from-emerald-500 to-teal-500",
        iconBg: "bg-gradient-to-br from-emerald-500 to-teal-500",
        href: "/admin/courses",
      },
      {
        title: "Enrollments",
        value: stats.totalEnrollments.toLocaleString(),
        subtitle: `${stats.activeEnrollments} active`,
        Icon: BookCheck,
        gradient: "bg-gradient-to-r from-amber-500 to-orange-500",
        iconBg: "bg-gradient-to-br from-amber-500 to-orange-500",
        href: "/admin/enrollments",
      },
      {
        title: "Revenue",
        value: formatCurrency(stats.totalRevenue),
        subtitle: "Paid payments",
        Icon: Wallet,
        gradient: "bg-gradient-to-r from-rose-500 to-pink-600",
        iconBg: "bg-gradient-to-br from-rose-500 to-pink-600",
        href: "/admin/payments",
      },
      {
        title: "Reviews",
        value: stats.totalReviews.toLocaleString(),
        subtitle:
          stats.averageRating > 0
            ? `Avg. ${stats.averageRating.toFixed(1)} ★`
            : "No ratings yet",
        Icon: Star,
        gradient: "bg-gradient-to-r from-yellow-400 to-amber-500",
        iconBg: "bg-gradient-to-br from-yellow-400 to-amber-500",
        href: "/admin/reviews",
      },
    ],
    [stats],
  );

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[color:var(--color-neutral-900)]">
            Dashboard
          </h1>
          <p className="text-sm text-[color:var(--color-neutral-500)] mt-0.5">
            Platform overview & recent activity
          </p>
        </div>
        <button
          id="dashboard-refresh-btn"
          onClick={refresh}
          disabled={isLoading}
          className={cn(
            "flex items-center gap-2 rounded-xl border border-[color:var(--color-neutral-200)] bg-white px-4 py-2 text-sm font-medium text-[color:var(--color-neutral-700)]",
            "hover:bg-[color:var(--color-neutral-50)] transition-colors shadow-xs",
            isLoading && "opacity-60 cursor-not-allowed",
          )}
        >
          <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          Refresh
        </button>
      </div>

      {/* Date range filter bar */}
      <div className="rounded-2xl border border-[color:var(--color-neutral-200)] bg-white px-5 py-4 shadow-sm">
        <DateRangeBar
          preset={preset}
          onPreset={handlePreset}
          customRange={customRange}
          onCustomRange={handleCustomRange}
          rangeLabel={rangeLabel}
        />
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error} — some data may be unavailable.</span>
        </div>
      )}

      {/* Smart Insights AI */}
      <SmartInsights stats={stats} loading={isLoading} />

      {/* KPI stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card, idx) => (
          <div key={card.title}>
            <StatCard {...card} loading={isLoading} />
          </div>
        ))}
      </div>

      {/* Main Layout Area */}
      <div className="space-y-4 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Platform Funnel */}
          <div className="rounded-2xl border border-[color:var(--color-neutral-200)] bg-white p-6 shadow-sm flex flex-col justify-center">
            <SectionHeader title="Platform Conversion Funnel" icon={Target} />
            <PlatformFunnel stats={stats} loading={isLoading} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Engagement Donut */}
            <div className="rounded-2xl border border-[color:var(--color-neutral-200)] bg-white p-6 shadow-sm">
              <SectionHeader title="Enrollment Engagement" icon={PieChart} />
              <EngagementDonut stats={stats} loading={isLoading} />
            </div>

            {/* Quick Actions */}
            <div className="rounded-2xl border border-[color:var(--color-neutral-200)] bg-white p-6 shadow-sm">
              <SectionHeader title="Quick Actions" icon={Lightbulb} />
              <div className="space-y-2">
                {[
                  {
                    label: "Create Course",
                    href: "/admin/courses",
                    Icon: BookOpen,
                    color:
                      "text-emerald-600 bg-emerald-50 hover:bg-emerald-100",
                  },
                  {
                    label: "Moderate Reviews",
                    href: "/admin/reviews",
                    Icon: Star,
                    color: "text-yellow-600 bg-yellow-50 hover:bg-yellow-100",
                  },
                  {
                    label: "View Enrollments",
                    href: "/admin/enrollments",
                    Icon: BookCheck,
                    color: "text-indigo-600 bg-indigo-50 hover:bg-indigo-100",
                  },
                  {
                    label: "Add Instructor",
                    href: "/admin/instructors",
                    Icon: School,
                    color: "text-violet-600 bg-violet-50 hover:bg-violet-100",
                  },
                ].map(({ label, href, Icon: Ic, color }) => (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[color:var(--color-neutral-700)] transition-colors border border-transparent",
                      color,
                    )}
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/60">
                      <Ic className="h-4 w-4" />
                    </div>
                    <span className="flex-1">{label}</span>
                    <ChevronRight className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Unified Activity Timeline */}
        <div className="rounded-2xl border border-[color:var(--color-neutral-200)] bg-white p-6 shadow-sm mt-4">
          <SectionHeader title="Recent Activity Timeline" icon={Activity} />
          <div className="mt-2">
            <UnifiedActivityTimeline
              enrollments={recentEnrollments}
              payments={recentPayments}
              loading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
