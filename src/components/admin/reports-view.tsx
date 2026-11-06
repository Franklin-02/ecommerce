"use client";

import { Download } from "lucide-react";
import { useMemo, useState } from "react";
import { RankedBars } from "@/components/charts/bar-chart";
import { ChartCard } from "@/components/charts/chart-card";
import { LineChart } from "@/components/charts/line-chart";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { PageHeader } from "@/components/dashboard/page-header";
import { RangeTabs } from "@/components/dashboard/range-tabs";
import { Button } from "@/components/ui/button";
import { summarizePeriod } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { formatCompactPrice, formatDate, formatNumber, formatShortDate } from "@/lib/format";
import { formatPrice } from "@/lib/pricing";
import { useOrders } from "@/stores/orders";
import { showToast } from "@/stores/toast";
import type { CategorySales, DailySales } from "@/types/commerce";
import { NameCell } from "./crud";
import { categoryRevenue, downloadCsv, topProducts, type ProductPerformance } from "./metrics";

const REPORTS = [
  { id: "sales", label: "Sales" },
  { id: "categories", label: "Categories" },
  { id: "products", label: "Top products" },
] as const;

type ReportId = (typeof REPORTS)[number]["id"];
type CategoryRow = ReturnType<typeof categoryRevenue>[number];

const dayColumns: Column<DailySales>[] = [
  { key: "date", header: "Date", sortValue: (day) => day.date, cell: (day) => <span className="whitespace-nowrap">{formatDate(day.date)}</span> },
  { key: "revenue", header: "Revenue", align: "right", sortValue: (day) => day.revenue, cell: (day) => formatPrice(day.revenue) },
  { key: "orders", header: "Orders", align: "right", sortValue: (day) => day.orders, cell: (day) => formatNumber(day.orders) },
  { key: "visitors", header: "Visitors", align: "right", hideBelow: "md", sortValue: (day) => day.visitors, cell: (day) => formatNumber(day.visitors) },
];

const categoryColumns: Column<CategoryRow>[] = [
  { key: "name", header: "Category", sortValue: (row) => row.label, cell: (row) => row.label },
  { key: "revenue", header: "Revenue", align: "right", sortValue: (row) => row.value, cell: (row) => formatPrice(row.value) },
  { key: "share", header: "Share", align: "right", sortValue: (row) => row.share, cell: (row) => `${row.share.toFixed(1)}%` },
];

const productColumns: Column<ProductPerformance>[] = [
  { key: "name", header: "Product", sortValue: (row) => row.name, cell: (row) => <NameCell image={row.image} name={row.name} /> },
  { key: "units", header: "Units", align: "right", sortValue: (row) => row.units, cell: (row) => formatNumber(row.units) },
  { key: "revenue", header: "Revenue", align: "right", sortValue: (row) => row.revenue, cell: (row) => formatPrice(row.revenue) },
];

interface ReportsViewProps {
  sales: DailySales[];
  categorySales: CategorySales[];
}

export function ReportsView({ sales, categorySales }: ReportsViewProps) {
  const [range, setRange] = useState(30);
  const [report, setReport] = useState<ReportId>("sales");
  const orders = useOrders();

  const period = useMemo(() => summarizePeriod(sales, range), [sales, range]);
  const categories = categoryRevenue(categorySales, period.revenue);
  const products = topProducts(orders, period.days[0].date, period.revenue, 20);

  const exportCsv = () => {
    const name = `kanishka-${report}-${range}-days.csv`;
    if (report === "sales") {
      downloadCsv(name, ["Date", "Revenue", "Orders", "Visitors"], period.days.map((day) => [day.date, day.revenue, day.orders, day.visitors]));
    } else if (report === "categories") {
      downloadCsv(name, ["Category", "Revenue", "Share %"], categories.map((row) => [row.label, row.value, row.share.toFixed(1)]));
    } else {
      downloadCsv(name, ["Product", "Units", "Revenue"], products.map((row) => [row.name, row.units, row.revenue]));
    }
    showToast(`${name} downloaded`);
  };

  return (
    <>
      <PageHeader
        title="Reports"
        description={`Showing the last ${range} days.`}
        actions={
          <>
            <RangeTabs value={range} onChange={setRange} />
            <Button variant="secondary" onClick={exportCsv}>
              <Download className="size-4" aria-hidden />
              Export CSV
            </Button>
          </>
        }
      />

      <div className="mb-3 grid grid-cols-2 gap-3 xl:grid-cols-4">
        <KpiCard label="Revenue" value={formatCompactPrice(period.revenue)} change={period.change.revenue} />
        <KpiCard label="Orders" value={formatNumber(period.orders)} change={period.change.orders} />
        <KpiCard label="Average order" value={formatPrice(Math.round(period.averageOrder))} change={period.change.averageOrder} />
        <KpiCard label="Conversion" value={`${period.conversion.toFixed(2)}%`} change={period.change.conversion} />
      </div>

      <div role="group" aria-label="Report" className="mb-3 flex gap-1 border-b border-line">
        {REPORTS.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={report === item.id}
            onClick={() => setReport(item.id)}
            className={cn(
              "-mb-px border-b-2 px-3 py-2 text-sm font-medium",
              report === item.id ? "border-brand-600 text-brand-700" : "border-transparent text-ink-600 hover:text-ink-950",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {report === "sales" && (
        <div className="space-y-3">
          <ChartCard
            title="Revenue"
            subtitle={`Daily, last ${range} days`}
            table={{ headers: ["Date", "Revenue"], rows: period.days.map((day) => [formatShortDate(day.date), formatPrice(day.revenue)]) }}
          >
            <LineChart
              area
              labels={period.days.map((day) => formatShortDate(day.date))}
              series={[{ label: "Revenue", values: period.days.map((day) => day.revenue) }]}
              ariaLabel={`Daily revenue for the last ${range} days`}
              formatAxis={formatCompactPrice}
              formatValue={formatPrice}
            />
          </ChartCard>
          <DataTable rows={[...period.days].reverse()} columns={dayColumns} getRowKey={(day) => day.date} label="Daily sales" pageSize={10} />
        </div>
      )}

      {report === "categories" && (
        <div className="space-y-3">
          <ChartCard
            title="Revenue by category"
            subtitle={`Last ${range} days`}
            table={{ headers: ["Category", "Revenue"], rows: categories.map((row) => [row.label, formatPrice(row.value)]) }}
          >
            <RankedBars items={categories} formatValue={formatCompactPrice} />
          </ChartCard>
          <DataTable rows={categories} columns={categoryColumns} getRowKey={(row) => row.label} label="Category sales" pageSize={12} />
        </div>
      )}

      {report === "products" && (
        <DataTable
          rows={products}
          columns={productColumns}
          getRowKey={(row) => row.productId}
          label="Top products"
          pageSize={10}
          emptyTitle="No sales in this period"
          emptyBody="Try a longer date range."
        />
      )}
    </>
  );
}
