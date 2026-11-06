import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  value: number;
  max: number;
  label: string;
  onChange: (value: number) => void;
}

export function QuantitySelector({ value, max, label, onChange }: QuantitySelectorProps) {
  const step = "grid size-8 place-items-center rounded-full text-ink-800 hover:bg-surface-sunken disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent";
  return (
    <div role="group" aria-label={`Quantity for ${label}`} className="inline-flex items-center rounded-full border border-line-strong">
      <button type="button" className={step} aria-label="Decrease quantity" disabled={value <= 1} onClick={() => onChange(value - 1)}>
        <Minus className="size-3.5" aria-hidden />
      </button>
      <span className="w-7 text-center text-sm font-semibold tabular-nums" aria-live="polite">
        {value}
      </span>
      <button type="button" className={step} aria-label="Increase quantity" disabled={value >= max} onClick={() => onChange(value + 1)}>
        <Plus className="size-3.5" aria-hidden />
      </button>
    </div>
  );
}
