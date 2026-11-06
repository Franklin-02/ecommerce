import type { Metadata } from "next";
import { Suspense } from "react";
import { getCurrentEmployee } from "@/services/employee";
import { getCustomers } from "@/services/operations";
import { EmployeeCustomerRoute } from "./customer-route";

export const metadata: Metadata = { title: "Customer" };

export default async function EmployeeCustomerPage() {
  const [customers, employee] = await Promise.all([getCustomers(), getCurrentEmployee()]);
  return (
    <Suspense>
      <EmployeeCustomerRoute customers={customers} employee={employee} />
    </Suspense>
  );
}
