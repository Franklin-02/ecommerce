"use client";

import { OrderDetail } from "@/components/account/order-detail";
import { useQueryId } from "@/lib/use-query-id";

export function AccountOrderRoute() {
  const id = useQueryId();
  return <OrderDetail key={id} id={id} />;
}
