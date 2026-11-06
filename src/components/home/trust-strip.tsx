import { Headset, RotateCcw, ShieldCheck, Truck, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/container";
import type { TrustIcon, TrustPoint } from "@/types/content";

const icons: Record<TrustIcon, LucideIcon> = {
  truck: Truck,
  shield: ShieldCheck,
  rotate: RotateCcw,
  headset: Headset,
};

export function TrustStrip({ points }: { points: TrustPoint[] }) {
  return (
    <Container className="mt-4">
      <ul className="grid grid-cols-2 gap-y-4 rounded-card border border-line px-5 py-4 lg:grid-cols-4">
        {points.map((point) => {
          const Icon = icons[point.icon];
          return (
            <li key={point.title} className="flex items-center gap-3">
              <Icon className="size-6 shrink-0 text-brand-600" strokeWidth={1.6} aria-hidden />
              <div>
                <p className="text-sm font-semibold text-ink-950">{point.title}</p>
                <p className="text-xs text-ink-500">{point.body}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </Container>
  );
}
