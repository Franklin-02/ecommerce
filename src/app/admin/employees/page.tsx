import type { Metadata } from "next";
import { EmployeesView } from "@/components/admin/employees-view";

export const metadata: Metadata = { title: "Employees | Admin" };

export default function Page() {
  return <EmployeesView />;
}
