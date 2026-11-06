import type { Metadata } from "next";
import { AssignedOrders } from "@/components/employee/assigned-orders";
import { getCurrentEmployee } from "@/services/employee";

export const metadata: Metadata = { title: "Assigned orders" };

export default async function AssignedOrdersPage() {
  return <AssignedOrders employee={await getCurrentEmployee()} />;
}
