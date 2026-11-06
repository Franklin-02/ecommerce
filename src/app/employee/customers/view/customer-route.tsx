"use client";

import { CustomerDetail } from "@/components/employee/customer-detail";
import { useQueryId } from "@/lib/use-query-id";
import type { Customer, Employee } from "@/types/commerce";

export function EmployeeCustomerRoute({ customers, employee }: { customers: Customer[]; employee: Employee }) {
  const id = useQueryId();
  return <CustomerDetail key={id} customer={customers.find((customer) => customer.id === id)} employee={employee} />;
}
