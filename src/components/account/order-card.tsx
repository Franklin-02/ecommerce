"use client";

import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate } from "@/lib/format";
import { formatPrice } from "@/lib/pricing";
import { orderStatusMeta } from "@/lib/status";
import { useSession } from "@/stores/auth";
import { useOrders } from "@/stores/orders";
import type { Order } from "@/types/commerce";

const MAX_THUMBNAILS = 3;

/** The signed-in customer's orders, newest first. */
export function useCustomerOrders() {
  const session = useSession();
  const orders = useOrders();
  return useMemo(
    () =>
      orders
        .filter((order) => order.customerId === session?.customerId)
        .sort((a, b) => b.placedAt.localeCompare(a.placedAt)),
    [orders, session?.customerId],
  );
}

export function OrderCard({ order }: { order: Order }) {
  const itemCount = order.lines.reduce((sum, line) => sum + line.quantity, 0);
  const extra = order.lines.length - MAX_THUMBNAILS;
  return (
    <Link
      href={`/account/orders/view?id=${order.id}`}
      aria-label={`Order ${order.number}, ${orderStatusMeta[order.status].label}`}
      className="group flex items-center gap-4 rounded-card border border-line p-4 transition-[box-shadow,border-color] hover:border-line-strong hover:shadow-card"
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <p className="font-mono text-sm font-medium text-ink-950">{order.number}</p>
          <StatusBadge {...orderStatusMeta[order.status]} />
        </div>
        <p className="mt-1 text-[0.8125rem] text-ink-500">
          {formatDate(order.placedAt)} · {itemCount} {itemCount === 1 ? "item" : "items"} · {formatPrice(order.total)}
        </p>
        <ul className="mt-3 flex items-center gap-2">
          {order.lines.slice(0, MAX_THUMBNAILS).map((line) => (
            <li key={line.productId} className="relative size-12 overflow-hidden rounded-lg bg-surface-muted">
              <Image src={line.image} alt="" fill sizes="48px" className="object-contain p-1" />
            </li>
          ))}
          {extra > 0 && <li className="text-xs font-medium text-ink-500">+{extra} more</li>}
        </ul>
      </div>
      <ChevronRight className="size-5 shrink-0 text-ink-400 transition-transform group-hover:translate-x-0.5" aria-hidden />
    </Link>
  );
}
