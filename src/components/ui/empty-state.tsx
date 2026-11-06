import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  body: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, body, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <span className="mb-4 grid size-14 place-items-center rounded-full bg-brand-50 text-brand-600">
        <Icon className="size-6" aria-hidden />
      </span>
      <h2 className="text-lg font-semibold tracking-tight text-ink-950">{title}</h2>
      <p className="mt-1.5 max-w-sm text-sm text-ink-500">{body}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
