"use client";

import { ArrowLeft, Check, PackageX } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmDialog } from "@/components/ui/modal";
import { StatusBadge } from "@/components/ui/status-badge";
import { cn } from "@/lib/cn";
import { formatDate, formatDateTime } from "@/lib/format";
import { formatPrice } from "@/lib/pricing";
import { gstLines } from "@/lib/tax";
import {
  deliveryMethods,
  orderFlow,
  orderStatusMeta,
  paymentMethodLabels,
  paymentStatusMeta,
} from "@/lib/status";
import { useSession } from "@/stores/auth";
import { updateOrderStatus, useOrder } from "@/stores/orders";
import { showToast } from "@/stores/toast";
import type { Order } from "@/types/commerce";

const CANCELLABLE = ["pending", "processing"];

function ProgressSteps({ order }: { order: Order }) {
  const current = orderFlow.indexOf(order.status);
  return (
    <ol className="grid gap-3 sm:grid-cols-5 sm:gap-0">
      {orderFlow.map((status, index) => {
        const reached = index <= current;
        const event = order.timeline.find((item) => item.status === status);
        return (
          <li key={status} aria-current={index === current ? "step" : undefined} className="relative flex items-center gap-3 sm:flex-col sm:items-start sm:gap-2">
            {index < orderFlow.length - 1 && (
              <span className={cn("absolute top-3.5 left-7 hidden h-0.5 w-[calc(100%-1.75rem)] sm:block", index < current ? "bg-brand-600" : "bg-line")} aria-hidden />
            )}
            <span className={cn("grid size-7 shrink-0 place-items-center rounded-full", reached ? "bg-brand-600 text-white" : "bg-surface-sunken text-ink-400")}>
              {reached ? <Check className="size-4" aria-hidden /> : <span className="size-2 rounded-full bg-current" aria-hidden />}
            </span>
            <div className="pr-2">
              <p className={cn("text-sm font-medium", reached ? "text-ink-950" : "text-ink-500")}>{orderStatusMeta[status].label}</p>
              {reached && event && <p className="text-xs text-ink-500">{formatDateTime(event.at)}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function SummaryRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={cn("flex justify-between gap-4", strong ? "mt-2 border-t border-line pt-2 text-base font-semibold text-ink-950" : "text-ink-600")}>
      <dt>{label}</dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  );
}

export function OrderDetail({ id }: { id: string }) {
  const session = useSession();
  const order = useOrder(id);
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const [confirmingReturn, setConfirmingReturn] = useState(false);

  // Someone else's order is treated exactly like one that doesn't exist.
  if (!order || order.customerId !== session?.customerId) {
    return (
      <div className="rounded-card border border-line">
        <EmptyState
          icon={PackageX}
          title="We couldn't find that order"
          body="It may belong to a different account, or the link may be wrong."
          action={<ButtonLink href="/account/orders">Back to your orders</ButtonLink>}
        />
      </div>
    );
  }

  const address = order.shippingAddress;
  const stopped = order.status === "cancelled" || order.status === "returned";
  const finalEvent = order.timeline[order.timeline.length - 1];

  return (
    <>
      <Link href="/account/orders" className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-ink-600 hover:text-brand-600">
        <ArrowLeft className="size-4" aria-hidden /> All orders
      </Link>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-mono text-xl font-medium text-ink-950 sm:text-2xl">{order.number}</h1>
            <StatusBadge {...orderStatusMeta[order.status]} />
          </div>
          <p className="mt-1 text-sm text-ink-500">Placed on {formatDate(order.placedAt)}</p>
        </div>
        {CANCELLABLE.includes(order.status) && (
          <Button variant="secondary" onClick={() => setConfirmingCancel(true)}>
            Cancel order
          </Button>
        )}
        {order.status === "delivered" && (
          <Button variant="secondary" onClick={() => setConfirmingReturn(true)}>
            Return order
          </Button>
        )}
      </div>

      <section aria-label="Order progress" className="mb-5 rounded-card border border-line p-5">
        {stopped ? (
          <p className="text-sm text-ink-800">
            <span className="font-semibold">{orderStatusMeta[order.status].label}</span> on {formatDateTime(finalEvent.at)}
            {finalEvent.note && `. ${finalEvent.note}.`} Your refund goes back to your original payment method.
          </p>
        ) : (
          <ProgressSteps order={order} />
        )}
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <section aria-labelledby="order-items" className="rounded-card border border-line p-5">
          <h2 id="order-items" className="mb-1 text-base font-semibold text-ink-950">
            Items
          </h2>
          <ul className="divide-y divide-line">
            {order.lines.map((line) => (
              <li key={line.productId} className="flex items-center gap-3 py-3">
                <span className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-surface-muted">
                  <Image src={line.image} alt="" fill sizes="64px" className="object-contain p-1.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <Link href={`/product/${line.slug}`} className="line-clamp-2 text-sm font-medium text-ink-950 hover:text-brand-600">
                    {line.name}
                  </Link>
                  <p className="mt-0.5 text-[0.8125rem] text-ink-500">
                    Qty {line.quantity} · {formatPrice(line.unitPrice)} each
                  </p>
                </div>
                <p className="text-sm font-semibold text-ink-950 tabular-nums">{formatPrice(line.unitPrice * line.quantity)}</p>
              </li>
            ))}
          </ul>
        </section>

        <div className="space-y-5">
          <section aria-labelledby="order-summary" className="rounded-card border border-line p-5">
            <h2 id="order-summary" className="mb-3 text-base font-semibold text-ink-950">
              Summary
            </h2>
            <dl className="space-y-1.5 text-sm">
              <SummaryRow label="Subtotal" value={formatPrice(order.subtotal)} />
              {order.discount > 0 && (
                <SummaryRow label={order.couponCode ? `Discount (${order.couponCode})` : "Discount"} value={`−${formatPrice(order.discount)}`} />
              )}
              <SummaryRow label="Delivery" value={order.shipping > 0 ? formatPrice(order.shipping) : "Free"} />
              <SummaryRow label="Total" value={formatPrice(order.total)} strong />
              {gstLines(order.tax, order.shippingAddress.state).map((line) => (
                <SummaryRow key={line.label} label={`Includes ${line.label}`} value={formatPrice(line.amount)} />
              ))}
            </dl>
          </section>

          <section aria-labelledby="order-delivery" className="rounded-card border border-line p-5">
            <h2 id="order-delivery" className="mb-2 text-base font-semibold text-ink-950">
              Delivery
            </h2>
            <p className="text-sm font-medium text-ink-800">{deliveryMethods[order.deliveryMethod].label}</p>
            <address className="mt-1 text-sm leading-6 text-ink-600 not-italic">
              {address.fullName}
              <br />
              {address.line1}
              {address.line2 && `, ${address.line2}`}
              <br />
              {address.city}, {address.state} – {address.pincode}
            </address>
          </section>

          <section aria-labelledby="order-payment" className="rounded-card border border-line p-5">
            <h2 id="order-payment" className="mb-2 text-base font-semibold text-ink-950">
              Payment
            </h2>
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-ink-600">{paymentMethodLabels[order.paymentMethod]}</p>
              <StatusBadge {...paymentStatusMeta[order.paymentStatus]} />
            </div>
          </section>
        </div>
      </div>

      <ConfirmDialog
        open={confirmingReturn}
        title="Return this order?"
        body={`We'll email a free return label for ${order.number} and refund you once it arrives.`}
        confirmLabel="Return order"
        onClose={() => setConfirmingReturn(false)}
        onConfirm={() => {
          updateOrderStatus(order.id, "returned", session.name, "Return requested by customer");
          showToast("Return started");
        }}
      />
      <ConfirmDialog
        open={confirmingCancel}
        title="Cancel this order?"
        body={`${order.number} will be cancelled and any payment refunded. This can't be undone.`}
        confirmLabel="Cancel order"
        onClose={() => setConfirmingCancel(false)}
        onConfirm={() => {
          updateOrderStatus(order.id, "cancelled", session.name, "Cancelled by customer");
          showToast("Order cancelled");
        }}
      />
    </>
  );
}
