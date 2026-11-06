import type { Metadata } from "next";
import { Suspense } from "react";
import { AccountOrderRoute } from "./order-route";

export const metadata: Metadata = { title: "Order details" };

export default function OrderDetailPage() {
  return (
    <Suspense>
      <AccountOrderRoute />
    </Suspense>
  );
}
