import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface PanelProps {
  title: string;
  action?: { label: string; href: string };
  className?: string;
  children: ReactNode;
}

export function Panel({ title, action, className, children }: PanelProps) {
  return (
    <section aria-label={title} className={cn("min-w-0 rounded-card border border-line bg-surface p-4", className)}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-[0.9375rem] font-semibold text-ink-950">{title}</h2>
        {action && (
          <Link href={action.href} className="text-[0.8125rem] font-semibold text-brand-600 hover:text-brand-700">
            {action.label}
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
