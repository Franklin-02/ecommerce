"use client";

import { OrderDetailView } from "@/components/admin/order-detail-view";
import { useQueryId } from "@/lib/use-query-id";

export function AdminOrderRoute() {
  const id = useQueryId();
  return <OrderDetailView key={id} id={id} />;
}
