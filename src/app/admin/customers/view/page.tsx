import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminCustomerRoute } from "./customer-route";

export const metadata: Metadata = { title: "Customer | Admin" };

export default function AdminCustomerPage() {
  return (
    <Suspense>
      <AdminCustomerRoute />
    </Suspense>
  );
}
