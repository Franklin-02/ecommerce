"use client";

import Link from "next/link";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate } from "@/lib/format";
import { formatPrice } from "@/lib/pricing";
import { customersCollection } from "@/stores/admin-data";
import { useOrders } from "@/stores/orders";
import type { Customer } from "@/types/commerce";
import { customerStats } from "./metrics";

export function CustomersView() {
  const customers = customersCollection.useItems();
  const orders = useOrders();
  const rows = customers.map((customer) => ({ ...customer, ...customerStats(orders, customer.id) }));
  type Row = (typeof rows)[number];

  const columns: Column<Row>[] = [
    {
      key: "name",
      header: "Customer",
      sortValue: (row) => row.name,
      cell: (row) => (
        <div className="min-w-40">
          <Link href={`/admin/customers/view?id=${row.id}`} className="font-medium text-brand-600 hover:underline">
            {row.name}
          </Link>
          <p className="text-xs text-ink-500">{row.email}</p>
        </div>
      ),
    },
    { key: "tier", header: "Tier", hideBelow: "md", sortValue: (row) => row.tier, cell: (row) => row.tier },
    { key: "orders", header: "Orders", align: "right", sortValue: (row) => row.orderCount, cell: (row) => row.orderCount },
    { key: "value", header: "Lifetime value", align: "right", sortValue: (row) => row.lifetimeValue, cell: (row) => formatPrice(row.lifetimeValue) },
    { key: "joined", header: "Joined", hideBelow: "lg", sortValue: (row) => row.joinedAt, cell: (row) => <span className="whitespace-nowrap">{formatDate(row.joinedAt)}</span> },
    {
      key: "status",
      header: "Status",
      hideBelow: "md",
      cell: (row) => <StatusBadge label={row.status === "active" ? "Active" : "Blocked"} tone={row.status === "active" ? "success" : "danger"} />,
    },
  ];

  return (
    <>
      <PageHeader title="Customers" description={`${customers.length} registered customers.`} />
      <DataTable
        rows={rows}
        columns={columns}
        getRowKey={(row) => row.id}
        label="Customers"
        searchPlaceholder="Search name or email"
        searchText={(row) => `${row.name} ${row.email}`}
        pageSize={12}
        filters={[
          {
            key: "tier",
            label: "All tiers",
            options: (["Standard", "Plus", "Pro"] as Customer["tier"][]).map((tier) => ({ value: tier, label: tier })),
            matches: (row, value) => row.tier === value,
          },
          {
            key: "status",
            label: "All statuses",
            options: [
              { value: "active", label: "Active" },
              { value: "blocked", label: "Blocked" },
            ],
            matches: (row, value) => row.status === value,
          },
        ]}
      />
    </>
  );
}
