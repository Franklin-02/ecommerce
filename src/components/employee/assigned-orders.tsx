"use client";

import Link from "next/link";
import { DataTable, type Column, type TableFilter } from "@/components/dashboard/data-table";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate } from "@/lib/format";
import { deliveryMethods, orderStatusMeta } from "@/lib/status";
import { useCurrentEmployee } from "@/stores/auth";
import type { Employee, Order } from "@/types/commerce";
import { ACTIVE_STATUSES, useAssignedOrders } from "./work";

const unitCount = (order: Order) => order.lines.reduce((sum, line) => sum + line.quantity, 0);

const columns: Column<Order>[] = [
  {
    key: "number",
    header: "Order",
    sortValue: (order) => order.number,
    cell: (order) => (
      <Link href={`/employee/orders/view?id=${order.id}`} className="font-semibold whitespace-nowrap text-brand-600 hover:text-brand-700">
        {order.number}
      </Link>
    ),
  },
  { key: "customer", header: "Customer", sortValue: (order) => order.customerName, cell: (order) => order.customerName },
  { key: "items", header: "Items", align: "right", hideBelow: "md", sortValue: unitCount, cell: unitCount },
  {
    key: "delivery",
    header: "Delivery",
    hideBelow: "lg",
    sortValue: (order) => order.deliveryMethod,
    cell: (order) => deliveryMethods[order.deliveryMethod].label,
  },
  {
    key: "placed",
    header: "Placed",
    hideBelow: "md",
    sortValue: (order) => order.placedAt,
    cell: (order) => <span className="whitespace-nowrap">{formatDate(order.placedAt)}</span>,
  },
  {
    key: "status",
    header: "Status",
    sortValue: (order) => ACTIVE_STATUSES.indexOf(order.status),
    cell: (order) => <StatusBadge {...orderStatusMeta[order.status]} />,
  },
];

const filters: TableFilter<Order>[] = [
  {
    key: "status",
    label: "All statuses",
    options: ACTIVE_STATUSES.map((status) => ({ value: status, label: orderStatusMeta[status].label })),
    matches: (order, value) => order.status === value,
  },
];

export function AssignedOrders({ employee: seed }: { employee: Employee }) {
  const employee = useCurrentEmployee(seed);
  const orders = useAssignedOrders(employee.id);
  return (
    <>
      <PageHeader title="Assigned orders" description="Orders in your queue, next-day delivery first." />
      <DataTable
        rows={orders}
        columns={columns}
        filters={filters}
        getRowKey={(order) => order.id}
        label="Assigned orders"
        searchPlaceholder="Search order, customer or product"
        searchText={(order) => `${order.number} ${order.customerName} ${order.lines.map((line) => line.name).join(" ")}`}
        emptyTitle="No matching orders"
        emptyBody="Your queue is clear, or nothing matches the search and filters."
      />
    </>
  );
}
