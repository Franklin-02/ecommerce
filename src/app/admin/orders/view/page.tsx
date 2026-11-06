import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminOrderRoute } from "./order-route";

export const metadata: Metadata = { title: "Order | Admin" };

export default function AdminOrderPage() {
  return (
    <Suspense>
      <AdminOrderRoute />
    </Suspense>
  );
}
