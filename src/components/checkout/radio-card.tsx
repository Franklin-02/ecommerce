import type { ReactNode } from "react";

interface RadioCardProps {
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  title: ReactNode;
  detail?: ReactNode;
  aside?: ReactNode;
}

export function RadioCard({ name, value, checked, onChange, title, detail, aside }: RadioCardProps) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-line-strong p-3.5 transition-colors hover:border-ink-400 has-checked:border-brand-600 has-checked:bg-brand-50 has-focus-visible:ring-2 has-focus-visible:ring-brand-300">
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="size-4 shrink-0 accent-brand-600" />
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-ink-950">{title}</span>
        {detail && <span className="block text-[0.8125rem] text-ink-500">{detail}</span>}
      </span>
      {aside && <span className="shrink-0 text-sm font-semibold text-ink-950">{aside}</span>}
    </label>
  );
}
