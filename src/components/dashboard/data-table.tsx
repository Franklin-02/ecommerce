"use client";

import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Inbox, Search } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/cn";

export interface Column<T> {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  /** Providing this makes the column sortable. */
  sortValue?: (row: T) => string | number;
  align?: "left" | "right";
  /** Hides the column below this breakpoint. */
  hideBelow?: "md" | "lg";
}

export interface TableFilter<T> {
  key: string;
  label: string;
  options: { value: string; label: string }[];
  matches: (row: T, value: string) => boolean;
}

interface DataTableProps<T> {
  rows: T[];
  columns: Column<T>[];
  getRowKey: (row: T) => string;
  /** Accessible name for the table. */
  label: string;
  searchPlaceholder?: string;
  searchText?: (row: T) => string;
  filters?: TableFilter<T>[];
  pageSize?: number;
  /** Extra controls on the right of the toolbar. */
  actions?: ReactNode;
  onRowClick?: (row: T) => void;
  emptyTitle?: string;
  emptyBody?: string;
}

const hideClass = { md: "hidden md:table-cell", lg: "hidden lg:table-cell" };

export function DataTable<T>({
  rows,
  columns,
  getRowKey,
  label,
  searchPlaceholder = "Search…",
  searchText,
  filters = [],
  pageSize = 10,
  actions,
  onRowClick,
  emptyTitle = "Nothing here yet",
  emptyBody = "Try clearing the search or filters.",
}: DataTableProps<T>) {
  const [query, setQuery] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [sort, setSort] = useState<{ key: string; descending: boolean } | null>(null);
  const [page, setPage] = useState(0);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = rows.filter(
      (row) =>
        (!needle || !searchText || searchText(row).toLowerCase().includes(needle)) &&
        filters.every((filter) => !filterValues[filter.key] || filter.matches(row, filterValues[filter.key])),
    );
    const column = sort && columns.find((candidate) => candidate.key === sort.key);
    if (!sort || !column?.sortValue) return filtered;
    const value = column.sortValue;
    return [...filtered].sort((a, b) => {
      const [x, y] = [value(a), value(b)];
      const order = typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y));
      return sort.descending ? -order : order;
    });
  }, [rows, query, searchText, filters, filterValues, sort, columns]);

  const pageCount = Math.max(1, Math.ceil(visible.length / pageSize));
  const safePage = Math.min(page, pageCount - 1);
  const pageRows = visible.slice(safePage * pageSize, (safePage + 1) * pageSize);

  const toggleSort = (key: string) => {
    setSort((current) => (current?.key === key ? { key, descending: !current.descending } : { key, descending: false }));
    setPage(0);
  };

  const hasToolbar = searchText || filters.length > 0 || actions;

  return (
    <div className="overflow-hidden rounded-card border border-line bg-surface">
      {hasToolbar && (
        <div className="flex flex-wrap items-center gap-2 border-b border-line p-3">
          {searchText && (
            <div className="relative min-w-48 flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-500" aria-hidden />
              <input
                type="search"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(0);
                }}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                className="h-10 w-full rounded-xl border border-line bg-surface-muted pr-3 pl-9 text-sm text-ink-950 placeholder:text-ink-500 focus:border-brand-500 focus:bg-surface focus:outline-none"
              />
            </div>
          )}
          {filters.map((filter) => (
            <select
              key={filter.key}
              aria-label={filter.label}
              value={filterValues[filter.key] ?? ""}
              onChange={(event) => {
                setFilterValues((values) => ({ ...values, [filter.key]: event.target.value }));
                setPage(0);
              }}
              className="h-10 rounded-xl border border-line bg-surface px-3 text-sm text-ink-800 focus:border-brand-500 focus:outline-none"
            >
              <option value="">{filter.label}</option>
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ))}
          {actions && <div className="ml-auto flex items-center gap-2">{actions}</div>}
        </div>
      )}

      {visible.length === 0 ? (
        <EmptyState icon={Inbox} title={emptyTitle} body={emptyBody} />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm" aria-label={label}>
            <thead>
              <tr className="border-b border-line bg-surface-muted">
                {columns.map((column) => {
                  const sorted = sort?.key === column.key;
                  return (
                    <th
                      key={column.key}
                      scope="col"
                      aria-sort={sorted ? (sort.descending ? "descending" : "ascending") : undefined}
                      className={cn(
                        "px-4 py-2.5 text-xs font-medium whitespace-nowrap text-ink-600",
                        column.align === "right" ? "text-right" : "text-left",
                        column.hideBelow && hideClass[column.hideBelow],
                      )}
                    >
                      {column.sortValue ? (
                        <button type="button" onClick={() => toggleSort(column.key)} className="inline-flex items-center gap-1 hover:text-ink-950">
                          {column.header}
                          {sorted && (sort.descending ? <ArrowDown className="size-3" aria-hidden /> : <ArrowUp className="size-3" aria-hidden />)}
                        </button>
                      ) : (
                        column.header
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {pageRows.map((row) => (
                <tr
                  key={getRowKey(row)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn("border-b border-line last:border-0", onRowClick && "cursor-pointer hover:bg-surface-muted")}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
                        "px-4 py-3 text-ink-800",
                        column.align === "right" && "text-right tabular-nums",
                        column.hideBelow && hideClass[column.hideBelow],
                      )}
                    >
                      {column.cell(row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {visible.length > 0 && (
        <div className="flex items-center justify-between border-t border-line px-4 py-2.5 text-[0.8125rem] text-ink-500">
          <p>
            {safePage * pageSize + 1}–{Math.min((safePage + 1) * pageSize, visible.length)} of {visible.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Previous page"
              disabled={safePage === 0}
              onClick={() => setPage(safePage - 1)}
              className="grid size-8 place-items-center rounded-lg hover:bg-surface-sunken disabled:opacity-35"
            >
              <ChevronLeft className="size-4" aria-hidden />
            </button>
            <span className="px-1 tabular-nums">
              {safePage + 1} / {pageCount}
            </span>
            <button
              type="button"
              aria-label="Next page"
              disabled={safePage >= pageCount - 1}
              onClick={() => setPage(safePage + 1)}
              className="grid size-8 place-items-center rounded-lg hover:bg-surface-sunken disabled:opacity-35"
            >
              <ChevronRight className="size-4" aria-hidden />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
