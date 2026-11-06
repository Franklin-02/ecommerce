import type { Metadata } from "next";
import { InventoryView } from "@/components/admin/inventory-view";

export const metadata: Metadata = { title: "Inventory | Admin" };

export default function Page() {
  return <InventoryView />;
}
