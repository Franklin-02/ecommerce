"use client";

import { CustomerDetailView } from "@/components/admin/customer-detail-view";
import { useQueryId } from "@/lib/use-query-id";

export function AdminCustomerRoute() {
  const id = useQueryId();
  return <CustomerDetailView key={id} id={id} />;
}
