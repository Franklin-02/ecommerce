"use client";

import Link from "next/link";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDateTime } from "@/lib/format";
import { formatPrice } from "@/lib/pricing";
import { orderStatusMeta, paymentStatusMeta } from "@/lib/status";
import { employeesCollection } from "@/stores/admin-data";
import { useOrders } from "@/stores/orders";
import type { Order } from "@/types/commerce";

export function OrdersView() {
  const orders = useOrders();
  const employees = employeesCollection.useItems();
  const staffName = (id?: string) => employees.find((employee) => employee.id === id)?.name ?? "Unassigned";

  const columns: Column<Order>[] = [
    {
      key: "number",
      header: "Order",
      sortValue: (order) => order.number,
      cell: (order) => (
        <Link href={`/admin/orders/view?id=${order.id}`} className="font-medium whitespace-nowrap text-brand-600 hover:underline">
          {order.number}
        </Link>
      ),
    },
    { key: "customer", header: "Customer", sortValue: (order) => order.customerName, cell: (order) => <span className="whitespace-nowrap">{order.customerName}</span> },
    { key: "placed", header: "Placed", hideBelow: "md", sortValue: (order) => order.placedAt, cell: (order) => <span className="whitespace-nowrap">{formatDateTime(order.placedAt)}</span> },
    { key: "assignee", header: "Assigned to", hideBelow: "lg", sortValue: (order) => staffName(order.assignedToId), cell: (order) => <span className="whitespace-nowrap">{staffName(order.assignedToId)}</span> },
    { key: "payment", header: "Payment", hideBelow: "lg", cell: (order) => <StatusBadge {...paymentStatusMeta[order.paymentStatus]} /> },
    { key: "status", header: "Status", sortValue: (order) => order.status, cell: (order) => <StatusBadge {...orderStatusMeta[order.status]} /> },
    { key: "total", header: "Total", align: "right", sortValue: (order) => order.total, cell: (order) => formatPrice(order.total) },
  ];

  return (
    <>
      <PageHeader title="Orders" description={`${orders.length} orders in total.`} />
      <DataTable
        rows={orders}
        columns={columns}
        getRowKey={(order) => order.id}
        label="Orders"
        searchPlaceholder="Search order, customer or email"
        searchText={(order) => `${order.number} ${order.customerName} ${order.customerEmail}`}
        pageSize={12}
        filters={[
          {
            key: "status",
            label: "All statuses",
            options: Object.entries(orderStatusMeta).map(([value, meta]) => ({ value, label: meta.label })),
            matches: (order, value) => order.status === value,
          },
          {
            key: "payment",
            label: "All payments",
            options: Object.entries(paymentStatusMeta).map(([value, meta]) => ({ value, label: meta.label })),
            matches: (order, value) => order.paymentStatus === value,
          },
        ]}
      />
    </>
  );
}
