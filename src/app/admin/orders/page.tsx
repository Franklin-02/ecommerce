import type { Metadata } from "next";
import { OrdersView } from "@/components/admin/orders-view";

export const metadata: Metadata = { title: "Orders | Admin" };

export default function Page() {
  return <OrdersView />;
}
