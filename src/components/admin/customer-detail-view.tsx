"use client";

import { ArrowLeft, UserX } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button, ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmDialog } from "@/components/ui/modal";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate, formatDateTime } from "@/lib/format";
import { formatPrice } from "@/lib/pricing";
import { orderStatusMeta } from "@/lib/status";
import { customersCollection } from "@/stores/admin-data";
import { useOrders } from "@/stores/orders";
import { showToast } from "@/stores/toast";
import type { Order } from "@/types/commerce";
import { customerStats } from "./metrics";

const columns: Column<Order>[] = [
  {
    key: "number",
    header: "Order",
    cell: (order) => (
      <Link href={`/admin/orders/view?id=${order.id}`} className="font-medium whitespace-nowrap text-brand-600 hover:underline">
        {order.number}
      </Link>
    ),
  },
  { key: "placed", header: "Placed", hideBelow: "md", sortValue: (order) => order.placedAt, cell: (order) => <span className="whitespace-nowrap">{formatDateTime(order.placedAt)}</span> },
  { key: "status", header: "Status", cell: (order) => <StatusBadge {...orderStatusMeta[order.status]} /> },
  { key: "total", header: "Total", align: "right", sortValue: (order) => order.total, cell: (order) => formatPrice(order.total) },
];

export function CustomerDetailView({ id }: { id: string }) {
  const customer = customersCollection.useItems().find((candidate) => candidate.id === id);
  const allOrders = useOrders();
  const [confirming, setConfirming] = useState(false);

  if (!customer) {
    return (
      <EmptyState
        icon={UserX}
        title="Customer not found"
        body="This customer doesn't exist or has been removed."
        action={<ButtonLink href="/admin/customers">Back to customers</ButtonLink>}
      />
    );
  }

  const stats = customerStats(allOrders, customer.id);
  const blocked = customer.status === "blocked";

  const setBlocked = (value: boolean) => {
    customersCollection.update(customer.id, { status: value ? "blocked" : "active" });
    showToast(`${customer.name} ${value ? "blocked" : "unblocked"}`);
  };

  return (
    <>
      <Link href="/admin/customers" className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-ink-600 hover:text-ink-950">
        <ArrowLeft className="size-4" aria-hidden /> Customers
      </Link>
      <PageHeader
        title={customer.name}
        description={`${customer.email} · ${customer.phone}`}
        actions={
          <>
            <StatusBadge label={blocked ? "Blocked" : "Active"} tone={blocked ? "danger" : "success"} />
            <Button variant="secondary" onClick={() => (blocked ? setBlocked(false) : setConfirming(true))}>
              {blocked ? "Unblock customer" : "Block customer"}
            </Button>
          </>
        }
      />

      <div className="mb-3 grid grid-cols-2 gap-3 xl:grid-cols-4">
        <KpiCard label="Lifetime value" value={formatPrice(stats.lifetimeValue)} hint="Excludes cancelled and returned" />
        <KpiCard label="Orders" value={String(stats.orderCount)} hint="All time" />
        <KpiCard label="Tier" value={customer.tier} hint="Loyalty level" />
        <KpiCard label="Customer since" value={formatDate(customer.joinedAt)} />
      </div>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
        <section aria-labelledby="customer-orders" className="min-w-0 xl:col-span-2">
          <h2 id="customer-orders" className="mb-2 text-[0.9375rem] font-semibold text-ink-950">
            Orders
          </h2>
          <DataTable
            rows={stats.orders}
            columns={columns}
            getRowKey={(order) => order.id}
            label="Customer orders"
            pageSize={8}
            emptyTitle="No orders yet"
            emptyBody="Orders this customer places will appear here."
          />
        </section>
        <section aria-labelledby="customer-addresses" className="min-w-0">
          <h2 id="customer-addresses" className="mb-2 text-[0.9375rem] font-semibold text-ink-950">
            Addresses
          </h2>
          <ul className="space-y-3">
            {customer.addresses.map((address) => (
              <li key={address.id} className="rounded-card border border-line bg-surface p-4">
                <p className="text-sm font-semibold text-ink-950">
                  {address.label}
                  {address.isDefault && <span className="ml-2 text-xs font-normal text-ink-500">Default</span>}
                </p>
                <address className="mt-1 text-sm text-ink-600 not-italic">
                  {address.line1}
                  {address.line2 && `, ${address.line2}`}
                  <br />
                  {address.city}, {address.state} – {address.pincode}
                </address>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <ConfirmDialog
        open={confirming}
        title="Block this customer?"
        body={`${customer.name} won't be able to sign in or place orders.`}
        confirmLabel="Block customer"
        onClose={() => setConfirming(false)}
        onConfirm={() => setBlocked(true)}
      />
    </>
  );
}
