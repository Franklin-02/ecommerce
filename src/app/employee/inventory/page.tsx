import type { Metadata } from "next";
import { InventoryLookup } from "@/components/employee/inventory-lookup";
import { getAllCategories } from "@/services/operations";

export const metadata: Metadata = { title: "Inventory" };

export default async function EmployeeInventoryPage() {
  return <InventoryLookup categories={await getAllCategories()} />;
}
