"use client";

import { Table2 } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  legend?: { label: string; color: string }[];
  /** Same data as a table: the accessible twin of the chart. */
  table: { headers: string[]; rows: (string | number)[][] };
  className?: string;
  children: ReactNode;
}

export function ChartCard({ title, subtitle, legend, table, className, children }: ChartCardProps) {
  const [showTable, setShowTable] = useState(false);
  return (
    <section aria-label={title} className={cn("flex min-w-0 flex-col rounded-card border border-line bg-surface p-4", className)}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[0.9375rem] font-semibold text-ink-950">{title}</h2>
          {subtitle && <p className="text-[0.8125rem] text-ink-500">{subtitle}</p>}
        </div>
        <button
          type="button"
          aria-pressed={showTable}
          onClick={() => setShowTable((value) => !value)}
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium",
            showTable ? "bg-ink-950 text-white" : "text-ink-600 hover:bg-surface-sunken",
          )}
        >
          <Table2 className="size-3.5" aria-hidden />
          Table
        </button>
      </div>
      {legend && legend.length > 1 && !showTable && (
        <ul className="mb-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-600">
          {legend.map((item) => (
            <li key={item.label} className="flex items-center gap-1.5">
              <span className="h-0.5 w-3.5 rounded-full" style={{ background: item.color }} aria-hidden />
              {item.label}
            </li>
          ))}
        </ul>
      )}
      {showTable ? (
        <div className="max-h-72 overflow-auto">
          <table className="w-full text-[0.8125rem]">
            <thead className="sticky top-0 bg-surface">
              <tr className="border-b border-line text-left text-ink-500">
                {table.headers.map((header, index) => (
                  <th key={header} scope="col" className={cn("py-1.5 pr-3 font-medium", index > 0 && "text-right")}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row) => (
                <tr key={String(row[0])} className="border-b border-line last:border-0">
                  {row.map((cell, index) => (
                    <td key={index} className={cn("py-1.5 pr-3 text-ink-800", index > 0 && "text-right tabular-nums")}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        children
      )}
    </section>
  );
}
