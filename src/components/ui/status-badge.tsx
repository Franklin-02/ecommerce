import { cn } from "@/lib/cn";
import type { StatusTone } from "@/lib/status";

const tones: Record<StatusTone, string> = {
  neutral: "bg-surface-sunken text-ink-600",
  info: "bg-brand-50 text-brand-700",
  progress: "bg-tint-violet text-[#4b34b8]",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-deal-soft text-deal",
};

/** Status is always a label plus a dot, never colour alone. */
export function StatusBadge({ label, tone }: { label: string; tone: StatusTone }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap", tones[tone])}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {label}
    </span>
  );
}
