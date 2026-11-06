"use client";

import { ArrowLeft, PackageSearch } from "lucide-react";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button, ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmDialog } from "@/components/ui/modal";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDateTime } from "@/lib/format";
import { formatPrice } from "@/lib/pricing";
import { gstLines } from "@/lib/tax";
import {
  deliveryMethods,
  nextOrderStatus,
  orderStatusMeta,
  paymentMethodLabels,
  paymentStatusMeta,
} from "@/lib/status";
import { employeesCollection } from "@/stores/admin-data";
import { assignOrder, updateOrderStatus, useOrder } from "@/stores/orders";
import { showToast } from "@/stores/toast";
import type { OrderStatus } from "@/types/commerce";
import { useSession } from "@/stores/auth";
import { ADMIN_USER } from "./admin-shell";
import { Thumb } from "./crud";

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section aria-label={title} className="rounded-card border border-line bg-surface p-4">
      <h2 className="mb-3 text-[0.9375rem] font-semibold text-ink-950">{title}</h2>
      {children}
    </section>
  );
}

function SummaryRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex justify-between py-0.5 text-sm ${strong ? "font-semibold text-ink-950" : "text-ink-600"}`}>
      <dt>{label}</dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  );
}

type PendingAction = { status: OrderStatus; title: string; body: string; confirmLabel: string };

export function OrderDetailView({ id }: { id: string }) {
  const session = useSession();
  const actorName = session?.name ?? ADMIN_USER.name;
  const order = useOrder(id);
  const employees = employeesCollection.useItems();
  const [pending, setPending] = useState<PendingAction | null>(null);

  if (!order) {
    return (
      <EmptyState
        icon={PackageSearch}
        title="Order not found"
        body="This order doesn't exist or has been removed."
        action={<ButtonLink href="/admin/orders">Back to orders</ButtonLink>}
      />
    );
  }

  const next = nextOrderStatus(order.status);
  const staff = employees.filter((employee) => employee.department === "Fulfillment" && employee.status === "active");
  const closed = order.status === "cancelled" || order.status === "returned";

  const changeStatus = (status: OrderStatus) => {
    updateOrderStatus(order.id, status, actorName);
    showToast(`${order.number} marked ${orderStatusMeta[status].label.toLowerCase()}`);
  };

  return (
    <>
      <Link href="/admin/orders" className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-ink-600 hover:text-ink-950">
        <ArrowLeft className="size-4" aria-hidden /> Orders
      </Link>
      <PageHeader
        title={order.number}
        description={`Placed ${formatDateTime(order.placedAt)}`}
        actions={
          <>
            {!closed && order.status !== "delivered" && (
              <Button
                variant="secondary"
                onClick={() =>
                  setPending({
                    status: "cancelled",
                    title: "Cancel this order?",
                    body: `${order.number} will be cancelled and ${formatPrice(order.total)} refunded.`,
                    confirmLabel: "Cancel order",
                  })
                }
              >
                Cancel order
              </Button>
            )}
            {order.status === "delivered" && (
              <Button
                variant="secondary"
                onClick={() =>
                  setPending({
                    status: "returned",
                    title: "Refund this order?",
                    body: `${order.number} will be marked returned and ${formatPrice(order.total)} refunded.`,
                    confirmLabel: "Refund order",
                  })
                }
              >
                Refund
              </Button>
            )}
            {next && <Button onClick={() => changeStatus(next)}>Mark as {orderStatusMeta[next].label.toLowerCase()}</Button>}
          </>
        }
      />

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
        <div className="min-w-0 space-y-3 xl:col-span-2">
          <Panel title="Items">
            <ul className="divide-y divide-line">
              {order.lines.map((line) => (
                <li key={line.productId} className="flex items-center gap-3 py-2.5">
                  <Thumb src={line.image} size={48} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink-950">{line.name}</p>
                    <p className="text-xs text-ink-500">
                      {line.quantity} × {formatPrice(line.unitPrice)}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-ink-950 tabular-nums">{formatPrice(line.unitPrice * line.quantity)}</p>
                </li>
              ))}
            </ul>
            <dl className="mt-2 border-t border-line pt-2">
              <SummaryRow label="Subtotal" value={formatPrice(order.subtotal)} />
              {order.discount > 0 && <SummaryRow label={`Discount (${order.couponCode})`} value={`−${formatPrice(order.discount)}`} />}
              <SummaryRow label="Shipping" value={order.shipping ? formatPrice(order.shipping) : "Free"} />
              <SummaryRow label="Total" value={formatPrice(order.total)} strong />
              {gstLines(order.tax, order.shippingAddress.state).map((line) => (
                <SummaryRow key={line.label} label={`Includes ${line.label}`} value={formatPrice(line.amount)} />
              ))}
            </dl>
          </Panel>

          <Panel title="Timeline">
            <ol className="space-y-3">
              {[...order.timeline].reverse().map((event, index) => (
                <li key={`${event.status}-${event.at}`} className="flex gap-3">
                  <span className={`mt-1.5 size-2.5 shrink-0 rounded-full ${index === 0 ? "bg-brand-600" : "bg-line-strong"}`} aria-hidden />
                  <div>
                    <p className="text-sm font-medium text-ink-950">{orderStatusMeta[event.status].label}</p>
                    <p className="text-xs text-ink-500">
                      {formatDateTime(event.at)}
                      {event.by && `, by ${event.by}`}
                      {event.note && `. ${event.note}`}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </Panel>
        </div>

        <div className="min-w-0 space-y-3">
          <Panel title="Status">
            <div className="flex flex-wrap gap-2">
              <StatusBadge {...orderStatusMeta[order.status]} />
              <StatusBadge {...paymentStatusMeta[order.paymentStatus]} />
            </div>
            <label htmlFor="order-assignee" className="mt-4 mb-1.5 block text-sm font-medium text-ink-800">
              Assigned to
            </label>
            <select
              id="order-assignee"
              value={order.assignedToId ?? ""}
              onChange={(event) => {
                assignOrder(order.id, event.target.value);
                showToast(`${order.number} assigned to ${staff.find((person) => person.id === event.target.value)?.name}`);
              }}
              className="h-11 w-full rounded-xl border border-line-strong bg-surface px-3 text-sm text-ink-950 focus:border-brand-500 focus:outline-none"
            >
              <option value="" disabled>
                Unassigned
              </option>
              {staff.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name}
                </option>
              ))}
            </select>
          </Panel>

          <Panel title="Customer">
            <Link href={`/admin/customers/view?id=${order.customerId}`} className="text-sm font-medium text-brand-600 hover:underline">
              {order.customerName}
            </Link>
            <p className="text-sm break-words text-ink-600">{order.customerEmail}</p>
            <p className="text-sm text-ink-600">{order.shippingAddress.phone}</p>
          </Panel>

          <Panel title="Delivery">
            <p className="text-sm font-medium text-ink-950">{deliveryMethods[order.deliveryMethod].label}</p>
            <address className="mt-1 text-sm text-ink-600 not-italic">
              {order.shippingAddress.fullName}
              <br />
              {order.shippingAddress.line1}
              {order.shippingAddress.line2 && (
                <>
                  <br />
                  {order.shippingAddress.line2}
                </>
              )}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.pincode}
            </address>
          </Panel>

          <Panel title="Payment">
            <p className="text-sm text-ink-600">{paymentMethodLabels[order.paymentMethod]}</p>
          </Panel>
        </div>
      </div>

      <ConfirmDialog
        open={pending !== null}
        title={pending?.title ?? ""}
        body={pending?.body ?? ""}
        confirmLabel={pending?.confirmLabel ?? "Confirm"}
        onClose={() => setPending(null)}
        onConfirm={() => {
          if (pending) changeStatus(pending.status);
        }}
      />
    </>
  );
}
