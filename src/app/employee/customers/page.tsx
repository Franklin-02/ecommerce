import type { Metadata } from "next";
import { CustomerDirectory } from "@/components/employee/customer-directory";
import { getCustomers } from "@/services/operations";

export const metadata: Metadata = { title: "Customers" };

export default async function EmployeeCustomersPage() {
  return <CustomerDirectory customers={await getCustomers()} />;
}
