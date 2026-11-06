import type { CategorySales, Order } from "@/types/commerce";

export interface ProductPerformance {
  productId: string;
  name: string;
  image: string;
  units: number;
  revenue: number;
}

const counted = (order: Order) => order.status !== "cancelled" && order.status !== "returned";

/** Best-selling products by revenue among orders placed on or after `startDate`. */
/**
 * The seeded orders are a small sample of the daily sales totals, so product
 * figures are scaled up to the period's revenue to keep them consistent with
 * the KPIs. With a real backend, orders are complete and the scaling goes away.
 */
export function topProducts(orders: Order[], startDate: string, periodRevenue: number, limit = 5): ProductPerformance[] {
  const totals = new Map<string, ProductPerformance>();
  for (const order of orders) {
    if (!counted(order) || order.placedAt.slice(0, 10) < startDate) continue;
    for (const line of order.lines) {
      const entry = totals.get(line.productId) ?? {
        productId: line.productId,
        name: line.name,
        image: line.image,
        units: 0,
        revenue: 0,
      };
      entry.units += line.quantity;
      entry.revenue += line.unitPrice * line.quantity;
      totals.set(line.productId, entry);
    }
  }
  const entries = [...totals.values()];
  const sampleRevenue = entries.reduce((sum, entry) => sum + entry.revenue, 0);
  const scale = sampleRevenue ? periodRevenue / sampleRevenue : 1;
  return entries
    .map((entry) => ({
      ...entry,
      units: Math.max(1, Math.round(entry.units * scale)),
      revenue: Math.round(entry.revenue * scale),
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);
}

/** Spreads a period's revenue across categories by their share of sales. */
export function categoryRevenue(sales: CategorySales[], periodRevenue: number) {
  const total = sales.reduce((sum, category) => sum + category.revenue, 0) || 1;
  return sales.map((category) => ({
    label: category.name,
    value: Math.round((category.revenue / total) * periodRevenue),
    share: (category.revenue / total) * 100,
  }));
}

export function customerStats(orders: Order[], customerId: string) {
  const own = orders.filter((order) => order.customerId === customerId);
  const value = own.filter(counted).reduce((sum, order) => sum + order.total, 0);
  return { orders: own, orderCount: own.length, lifetimeValue: Math.round(value * 100) / 100 };
}

/** Builds a CSV in the browser and hands it to the viewer as a download. */
export function downloadCsv(filename: string, headers: string[], rows: (string | number)[][]) {
  const escape = (cell: string | number) => `"${String(cell).replace(/"/g, '""')}"`;
  const csv = [headers, ...rows].map((row) => row.map(escape).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
