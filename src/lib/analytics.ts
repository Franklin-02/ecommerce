import type { DailySales } from "@/types/commerce";

export interface PeriodSummary {
  days: DailySales[];
  revenue: number;
  orders: number;
  visitors: number;
  averageOrder: number;
  conversion: number;
  /** Percentage change against the preceding period of equal length. */
  change: { revenue: number; orders: number; averageOrder: number; conversion: number };
}

const totals = (days: DailySales[]) => {
  const revenue = days.reduce((sum, day) => sum + day.revenue, 0);
  const orders = days.reduce((sum, day) => sum + day.orders, 0);
  const visitors = days.reduce((sum, day) => sum + day.visitors, 0);
  return {
    revenue,
    orders,
    visitors,
    averageOrder: orders ? revenue / orders : 0,
    conversion: visitors ? (orders / visitors) * 100 : 0,
  };
};

const percentChange = (now: number, before: number) => (before ? ((now - before) / before) * 100 : 0);

/** Summarizes the latest `length` days. `series` must be oldest-first. */
export function summarizePeriod(series: DailySales[], length: number): PeriodSummary {
  const days = series.slice(-length);
  const previous = series.slice(-length * 2, -length);
  const now = totals(days);
  const before = totals(previous);
  return {
    days,
    ...now,
    change: {
      revenue: percentChange(now.revenue, before.revenue),
      orders: percentChange(now.orders, before.orders),
      averageOrder: percentChange(now.averageOrder, before.averageOrder),
      conversion: percentChange(now.conversion, before.conversion),
    },
  };
}
