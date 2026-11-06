"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ColumnChart, RankedBars } from "@/components/charts/bar-chart";
import { ChartCard } from "@/components/charts/chart-card";
import { LineChart } from "@/components/charts/line-chart";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { PageHeader } from "@/components/dashboard/page-header";
import { RangeTabs } from "@/components/dashboard/range-tabs";
import { StatusBadge } from "@/components/ui/status-badge";
import { summarizePeriod } from "@/lib/analytics";
import { formatCompact, formatCompactPrice, formatDateTime, formatNumber, formatShortDate } from "@/lib/format";
import { formatPrice } from "@/lib/pricing";
import { orderStatusMeta, stockState, stockStateMeta } from "@/lib/status";
import { inventoryCollection } from "@/stores/admin-data";
import { useOrders } from "@/stores/orders";
import type { CategorySales, DailySales, Order } from "@/types/commerce";
import { Thumb } from "./crud";
import { categoryRevenue, topProducts } from "./metrics";

const orderColumns: Column<Order>[] = [
  {
    key: "number",
    header: "Order",
    cell: (order) => (
      <Link href={`/admin/orders/view?id=${order.id}`} className="font-medium whitespace-nowrap text-brand-600 hover:underline">
        {order.number}
      </Link>
    ),
  },
  { key: "customer", header: "Customer", cell: (order) => <span className="whitespace-nowrap">{order.customerName}</span> },
  { key: "date", header: "Placed", hideBelow: "md", cell: (order) => <span className="whitespace-nowrap">{formatDateTime(order.placedAt)}</span> },
  { key: "status", header: "Status", cell: (order) => <StatusBadge {...orderStatusMeta[order.status]} /> },
  { key: "total", header: "Total", align: "right", cell: (order) => formatPrice(order.total) },
];

interface DashboardViewProps {
  sales: DailySales[];
  categorySales: CategorySales[];
}

export function DashboardView({ sales, categorySales }: DashboardViewProps) {
  const [range, setRange] = useState(30);
  const orders = useOrders();
  const inventory = inventoryCollection.useItems();

  const period = useMemo(() => summarizePeriod(sales, range), [sales, range]);
  const labels = period.days.map((day) => formatShortDate(day.date));
  const categories = categoryRevenue(categorySales, period.revenue);
  const sellers = topProducts(orders, period.days[0].date, period.revenue);
  const alerts = inventory
    .filter((item) => stockState(item) !== "in-stock")
    .sort((a, b) => a.onHand - b.onHand)
    .slice(0, 6);

  return (
    <>
      <PageHeader title="Dashboard" description="How the store is performing." actions={<RangeTabs value={range} onChange={setRange} />} />

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <KpiCard label="Revenue" value={formatCompactPrice(period.revenue)} change={period.change.revenue} />
        <KpiCard label="Orders" value={formatNumber(period.orders)} change={period.change.orders} />
        <KpiCard label="Average order" value={formatPrice(Math.round(period.averageOrder))} change={period.change.averageOrder} />
        <KpiCard label="Conversion" value={`${period.conversion.toFixed(2)}%`} change={period.change.conversion} />
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-3">
        <ChartCard
          className="xl:col-span-2"
          title="Sales overview"
          subtitle={`Daily revenue, last ${range} days`}
          table={{
            headers: ["Date", "Revenue"],
            rows: period.days.map((day) => [formatShortDate(day.date), formatPrice(day.revenue)]),
          }}
        >
          <LineChart
            area
            labels={labels}
            series={[{ label: "Revenue", values: period.days.map((day) => day.revenue) }]}
            ariaLabel={`Daily revenue for the last ${range} days, totaling ${formatPrice(period.revenue)}`}
            formatAxis={formatCompactPrice}
            formatValue={formatPrice}
          />
        </ChartCard>
        <ChartCard
          title="Revenue by category"
          subtitle={`Last ${range} days`}
          table={{ headers: ["Category", "Revenue"], rows: categories.map((item) => [item.label, formatPrice(item.value)]) }}
        >
          <RankedBars items={categories.slice(0, 8)} formatValue={formatCompactPrice} />
        </ChartCard>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-3">
        <ChartCard
          className="xl:col-span-2"
          title="Orders"
          subtitle={`Orders per day, last ${range} days`}
          table={{
            headers: ["Date", "Orders"],
            rows: period.days.map((day) => [formatShortDate(day.date), formatNumber(day.orders)]),
          }}
        >
          <ColumnChart
            labels={labels}
            values={period.days.map((day) => day.orders)}
            seriesLabel="Orders"
            ariaLabel={`Orders per day for the last ${range} days, totaling ${formatNumber(period.orders)}`}
            formatAxis={formatCompact}
            formatValue={formatNumber}
          />
        </ChartCard>
        <section aria-labelledby="top-products" className="rounded-card border border-line bg-surface p-4">
          <h2 id="top-products" className="text-[0.9375rem] font-semibold text-ink-950">
            Top-selling products
          </h2>
          <p className="mb-3 text-[0.8125rem] text-ink-500">By revenue, last {range} days</p>
          {sellers.length === 0 ? (
            <p className="text-sm text-ink-500">No sales in this period.</p>
          ) : (
            <ol className="space-y-3">
              {sellers.map((product) => (
                <li key={product.productId} className="flex items-center gap-3">
                  <Thumb src={product.image} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink-950">{product.name}</p>
                    <p className="text-xs text-ink-500">{formatNumber(product.units)} sold</p>
                  </div>
                  <p className="text-sm font-semibold text-ink-950 tabular-nums">{formatPrice(product.revenue)}</p>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-3">
        <section aria-labelledby="recent-orders" className="min-w-0 xl:col-span-2">
          <div className="mb-2 flex items-center justify-between">
            <h2 id="recent-orders" className="text-[0.9375rem] font-semibold text-ink-950">
              Recent orders
            </h2>
            <Link href="/admin/orders" className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline">
              All orders <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <DataTable rows={orders.slice(0, 6)} columns={orderColumns} getRowKey={(order) => order.id} label="Recent orders" />
        </section>
        <section aria-labelledby="inventory-alerts" className="min-w-0">
          <div className="mb-2 flex items-center justify-between">
            <h2 id="inventory-alerts" className="text-[0.9375rem] font-semibold text-ink-950">
              Inventory alerts
            </h2>
            <Link href="/admin/inventory" className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline">
              Inventory <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <ul className="divide-y divide-line rounded-card border border-line bg-surface">
            {alerts.map((item) => (
              <li key={item.productId} className="flex items-center gap-3 p-3">
                <Thumb src={item.image} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink-950">{item.name}</p>
                  <p className="text-xs text-ink-500">
                    {item.onHand} on hand, reorder at {item.reorderPoint}
                  </p>
                </div>
                <StatusBadge {...stockStateMeta[stockState(item)]} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
