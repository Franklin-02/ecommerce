import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";

interface KpiCardProps {
  label: string;
  value: string;
  /** Percentage change against the previous period. */
  change?: number;
  /** Named comparison shown after the delta. */
  comparison?: string;
  /** Set false when a rise is bad, such as return rate. */
  upIsGood?: boolean;
  hint?: string;
}

export function KpiCard({ label, value, change, comparison = "vs previous period", upIsGood = true, hint }: KpiCardProps) {
  const up = (change ?? 0) >= 0;
  const good = up === upIsGood;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <div className="rounded-card border border-line bg-surface p-4">
      <p className="text-sm text-ink-600">{label}</p>
      <p className="mt-1.5 text-[1.75rem] leading-8 font-semibold tracking-tight text-ink-950">{value}</p>
      {change !== undefined ? (
        <p className="mt-1.5 flex flex-wrap items-center gap-x-1 text-xs text-ink-500">
          <span className={cn("inline-flex items-center font-semibold", good ? "text-success" : "text-deal")}>
            <Icon className="size-3.5" aria-hidden />
            {up ? "+" : "−"}
            {Math.abs(change).toFixed(1)}%
          </span>
          {comparison}
        </p>
      ) : (
        hint && <p className="mt-1.5 text-xs text-ink-500">{hint}</p>
      )}
    </div>
  );
}
