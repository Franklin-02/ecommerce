"use client";

import { Package } from "lucide-react";
import { useState } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/cn";
import type { Order } from "@/types/commerce";
import { OrderCard, useCustomerOrders } from "./order-card";

const filters: { key: string; label: string; matches: (order: Order) => boolean }[] = [
  { key: "all", label: "All", matches: () => true },
  { key: "active", label: "In progress", matches: (order) => ["pending", "processing", "packed", "shipped"].includes(order.status) },
  { key: "delivered", label: "Delivered", matches: (order) => order.status === "delivered" },
  { key: "closed", label: "Cancelled & returned", matches: (order) => ["cancelled", "returned"].includes(order.status) },
];

export function OrderHistory() {
  const orders = useCustomerOrders();
  const [filterKey, setFilterKey] = useState("all");
  const filter = filters.find((item) => item.key === filterKey) ?? filters[0];
  const visible = orders.filter(filter.matches);

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight text-ink-950 sm:text-3xl">Orders</h1>
      <p className="mt-1 mb-5 text-sm text-ink-500">Track, review and manage everything you&apos;ve ordered.</p>

      {orders.length > 0 && (
        <div role="group" aria-label="Filter orders" className="scrollbar-none -mx-4 mb-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          {filters.map((item) => (
            <button
              key={item.key}
              type="button"
              aria-pressed={item.key === filterKey}
              onClick={() => setFilterKey(item.key)}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                item.key === filterKey ? "bg-ink-950 text-white" : "bg-surface-muted text-ink-600 hover:bg-surface-sunken",
              )}
            >
              {item.label} ({orders.filter(item.matches).length})
            </button>
          ))}
        </div>
      )}

      {visible.length === 0 ? (
        <div className="rounded-card border border-line">
          {orders.length === 0 ? (
            <EmptyState
              icon={Package}
              title="No orders yet"
              body="When you place an order, you can track it here."
              action={<ButtonLink href="/categories">Start shopping</ButtonLink>}
            />
          ) : (
            <EmptyState
              icon={Package}
              title="No orders match this filter"
              body="Try a different status."
              action={
                <Button variant="secondary" onClick={() => setFilterKey("all")}>
                  Show all orders
                </Button>
              }
            />
          )}
        </div>
      ) : (
        <ul className="space-y-3">
          {visible.map((order) => (
            <li key={order.id}>
              <OrderCard order={order} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
