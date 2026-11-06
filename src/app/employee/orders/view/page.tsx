import type { Metadata } from "next";
import { Suspense } from "react";
import { getCurrentEmployee } from "@/services/employee";
import { EmployeeOrderRoute } from "./order-route";

export const metadata: Metadata = { title: "Process order" };

export default async function OrderProcessingPage() {
  const employee = await getCurrentEmployee();
  return (
    <Suspense>
      <EmployeeOrderRoute employee={employee} />
    </Suspense>
  );
}
