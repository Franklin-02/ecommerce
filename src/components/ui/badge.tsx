import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "deal" | "new" | "neutral" | "warning";

const tones: Record<Tone, string> = {
  deal: "bg-deal text-white",
  new: "bg-ink-950 text-white",
  neutral: "bg-surface-sunken text-ink-600",
  warning: "bg-warning-soft text-warning",
};

export function Badge({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 font-mono text-[0.6875rem] font-medium", tones[tone])}>
      {children}
    </span>
  );
}
