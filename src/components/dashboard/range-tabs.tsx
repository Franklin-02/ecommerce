"use client";

import { cn } from "@/lib/cn";

export const RANGES = [
  { days: 7, label: "7 days" },
  { days: 30, label: "30 days" },
  { days: 90, label: "90 days" },
];

/** The single date filter that scopes everything below it on a dashboard. */
export function RangeTabs({ value, onChange }: { value: number; onChange: (days: number) => void }) {
  return (
    <div role="group" aria-label="Date range" className="inline-flex rounded-xl border border-line bg-surface p-1">
      {RANGES.map((range) => (
        <button
          key={range.days}
          type="button"
          aria-pressed={value === range.days}
          onClick={() => onChange(range.days)}
          className={cn(
            "rounded-lg px-3 py-1.5 text-[0.8125rem] font-medium transition-colors",
            value === range.days ? "bg-ink-950 text-white" : "text-ink-600 hover:bg-surface-sunken",
          )}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}
