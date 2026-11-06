"use client";

import Link from "next/link";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { formatShortDate } from "@/lib/format";
import { nextOrderStatus, orderStatusMeta } from "@/lib/status";
import { updateOrderStatus } from "@/stores/orders";
import { showToast } from "@/stores/toast";
import { useCurrentEmployee } from "@/stores/auth";
import type { Employee, Order } from "@/types/commerce";
import { ACTIVE_STATUSES, advanceLabels, useAssignedOrders } from "./work";

function BoardCard({ order, employee }: { order: Order; employee: Employee }) {
  const next = nextOrderStatus(order.status);
  const units = order.lines.reduce((sum, line) => sum + line.quantity, 0);
  return (
    <li className="rounded-xl border border-line bg-surface p-3">
      <div className="flex items-start justify-between gap-2">
        <Link href={`/employee/orders/view?id=${order.id}`} className="text-sm font-semibold text-ink-950 hover:text-brand-600">
          {order.number}
        </Link>
        {order.deliveryMethod === "next-day" && <Badge tone="warning">Next-day</Badge>}
      </div>
      <p className="mt-0.5 truncate text-[0.8125rem] text-ink-600">{order.customerName}</p>
      <p className="text-xs text-ink-500">
        {units} {units === 1 ? "item" : "items"} · {formatShortDate(order.placedAt)}
      </p>
      <div className="mt-2.5">
        {/* Packing always goes through the pick list, so it has no one-click shortcut. */}
        {order.status === "processing" ? (
          <ButtonLink href={`/employee/orders/view?id=${order.id}`} size="sm" variant="secondary" className="w-full">
            Open pick list
          </ButtonLink>
        ) : (
          next && (
            <Button
              size="sm"
              className="w-full"
              onClick={() => {
                updateOrderStatus(order.id, next, employee.name);
                showToast(`${order.number} is now ${orderStatusMeta[next].label.toLowerCase()}`);
              }}
            >
              {advanceLabels[next]}
            </Button>
          )
        )}
      </div>
    </li>
  );
}

export function ProcessingBoard({ employee: seed }: { employee: Employee }) {
  const employee = useCurrentEmployee(seed);
  const orders = useAssignedOrders(employee.id);
  return (
    <>
      <PageHeader title="Order processing" description="Your orders by stage. Move them along as the work is done." />
      <div className="grid gap-4 lg:grid-cols-3">
        {ACTIVE_STATUSES.map((stage) => {
          const stageOrders = orders.filter((order) => order.status === stage);
          return (
            <section key={stage} aria-label={orderStatusMeta[stage].label} className="min-w-0 rounded-card bg-surface-sunken p-3">
              <h2 className="mb-2.5 flex items-center justify-between px-1 text-sm font-semibold text-ink-950">
                {orderStatusMeta[stage].label}
                <span className="rounded-full bg-surface px-2 py-0.5 text-xs font-medium text-ink-600 tabular-nums">{stageOrders.length}</span>
              </h2>
              {stageOrders.length === 0 ? (
                <p className="rounded-xl border border-dashed border-line-strong p-4 text-center text-[0.8125rem] text-ink-500">
                  Nothing at this stage
                </p>
              ) : (
                <ul className="space-y-2">
                  {stageOrders.map((order) => (
                    <BoardCard key={order.id} order={order} employee={employee} />
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </>
  );
}
