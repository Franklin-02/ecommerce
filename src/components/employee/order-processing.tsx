"use client";

import { ArrowLeft, Mail, PackageSearch, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button, ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { CheckboxField, Form, TextAreaField } from "@/components/ui/form";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDateTime } from "@/lib/format";
import { deliveryMethods, nextOrderStatus, orderStatusMeta } from "@/lib/status";
import { inventoryCollection } from "@/stores/admin-data";
import { updateOrderStatus, useOrder } from "@/stores/orders";
import { showToast } from "@/stores/toast";
import { useCurrentEmployee } from "@/stores/auth";
import type { Employee, Order } from "@/types/commerce";
import { Panel } from "./panel";
import { advanceLabels } from "./work";

function PickList({ order, picked, onToggle }: { order: Order; picked: string[]; onToggle: (id: string, on: boolean) => void }) {
  const inventory = inventoryCollection.useItems();
  const picking = order.status === "pending" || order.status === "processing";
  const binFor = (productId: string) => inventory.find((item) => item.productId === productId)?.bin ?? "Unassigned";

  return (
    <Panel title={picking ? `Pick list (${picked.length} of ${order.lines.length})` : "Items in this order"}>
      <ul className="space-y-2">
        {order.lines.map((line) => {
          const content = (
            <span className="flex min-w-0 items-center gap-3">
              <span className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
                <Image src={line.image} alt="" fill sizes="48px" className="object-contain p-1" />
              </span>
              <span className="min-w-0">
                <span className="block font-medium text-ink-950">
                  {line.quantity} × {line.name}
                </span>
                <span className="block font-mono text-xs text-ink-500">Bin {binFor(line.productId)}</span>
              </span>
            </span>
          );
          return (
            <li key={line.productId}>
              {picking ? (
                <CheckboxField
                  className="rounded-xl border border-line p-2.5 hover:border-line-strong"
                  checked={picked.includes(line.productId)}
                  onChange={(event) => onToggle(line.productId, event.target.checked)}
                  label={content}
                />
              ) : (
                <div className="rounded-xl border border-line p-2.5 text-sm">{content}</div>
              )}
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}

export function OrderProcessing({ orderId, employee: seed }: { orderId: string; employee: Employee }) {
  const employee = useCurrentEmployee(seed);
  const order = useOrder(orderId);
  const [picked, setPicked] = useState<string[]>([]);

  if (!order || order.assignedToId !== employee.id) {
    return (
      <EmptyState
        icon={PackageSearch}
        title="Order not found"
        body="This order doesn't exist or isn't assigned to you."
        action={<ButtonLink href="/employee/orders">Back to assigned orders</ButtonLink>}
      />
    );
  }

  const status = orderStatusMeta[order.status];
  const next = nextOrderStatus(order.status);
  const needsPicking = next === "packed";
  const allPicked = picked.length === order.lines.length;
  const address = order.shippingAddress;

  return (
    <>
      <Link href="/employee/orders" className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-ink-600 hover:text-ink-950">
        <ArrowLeft className="size-4" aria-hidden />
        Assigned orders
      </Link>
      <PageHeader
        title={order.number}
        description={`Placed ${formatDateTime(order.placedAt)} · ${deliveryMethods[order.deliveryMethod].label}`}
        actions={<StatusBadge {...status} />}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="grid min-w-0 content-start gap-4 lg:col-span-2">
          <PickList
            order={order}
            picked={picked}
            onToggle={(id, on) => setPicked((current) => (on ? [...current, id] : current.filter((item) => item !== id)))}
          />

          <Panel title="Update status">
            {next ? (
              <Form
                onValid={(values, form) => {
                  updateOrderStatus(order.id, next, employee.name, values.note.trim() || undefined);
                  showToast(`${order.number} is now ${orderStatusMeta[next].label.toLowerCase()}`);
                  form.reset();
                }}
              >
                <TextAreaField name="note" label="Note (optional)" hint="Shown on the order timeline." maxLength={200} />
                <div className="col-span-full flex flex-wrap items-center gap-3">
                  <Button type="submit" disabled={needsPicking && !allPicked}>
                    {advanceLabels[next]}
                  </Button>
                  {needsPicking && !allPicked && <p className="text-[0.8125rem] text-ink-500">Tick every item to enable packing.</p>}
                </div>
              </Form>
            ) : (
              <p className="text-sm text-ink-600">This order is {status.label.toLowerCase()}, so no further action is needed.</p>
            )}
          </Panel>
        </div>

        <div className="grid min-w-0 content-start gap-4">
          <Panel title="Customer" action={{ label: "View", href: `/employee/customers/view?id=${order.customerId}` }}>
            <p className="text-sm font-medium text-ink-950">{order.customerName}</p>
            <ul className="mt-2 space-y-1.5 text-sm text-ink-600">
              <li>
                <a href={`mailto:${order.customerEmail}`} className="inline-flex max-w-full items-center gap-2 hover:text-ink-950">
                  <Mail className="size-4 shrink-0" aria-hidden />
                  <span className="truncate">{order.customerEmail}</span>
                </a>
              </li>
              {address.phone && (
                <li>
                  <a href={`tel:${address.phone}`} className="inline-flex items-center gap-2 hover:text-ink-950">
                    <Phone className="size-4 shrink-0" aria-hidden />
                    {address.phone}
                  </a>
                </li>
              )}
            </ul>
          </Panel>

          <Panel title="Ship to">
            <address className="text-sm leading-6 text-ink-800 not-italic">
              {address.fullName}
              <br />
              {address.line1}
              {address.line2 && (
                <>
                  <br />
                  {address.line2}
                </>
              )}
              <br />
              {address.city}, {address.state} – {address.pincode}
            </address>
          </Panel>

          <Panel title="Timeline">
            <ol className="space-y-3">
              {order.timeline.map((event, index) => (
                <li key={`${event.status}-${index}`} className="relative border-l-2 border-line pl-3.5">
                  <span className="absolute top-1.5 -left-[5px] size-2 rounded-full bg-brand-600" aria-hidden />
                  <p className="text-sm font-medium text-ink-950">{orderStatusMeta[event.status].label}</p>
                  <p className="text-xs text-ink-500">
                    {formatDateTime(event.at)}
                    {event.by && ` · ${event.by}`}
                  </p>
                  {event.note && <p className="mt-0.5 text-[0.8125rem] text-ink-600">{event.note}</p>}
                </li>
              ))}
            </ol>
          </Panel>
        </div>
      </div>
    </>
  );
}
