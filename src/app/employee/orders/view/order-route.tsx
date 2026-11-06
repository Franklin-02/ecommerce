"use client";

import { OrderProcessing } from "@/components/employee/order-processing";
import { useQueryId } from "@/lib/use-query-id";
import type { Employee } from "@/types/commerce";

export function EmployeeOrderRoute({ employee }: { employee: Employee }) {
  const id = useQueryId();
  return <OrderProcessing key={id} orderId={id} employee={employee} />;
}
