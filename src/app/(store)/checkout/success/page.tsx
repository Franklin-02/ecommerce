import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderSuccess } from "@/components/checkout/order-success";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = { title: "Order confirmed" };

export default function OrderSuccessPage() {
  return (
    <Container className="pt-8 pb-16">
      <Suspense fallback={<div className="mx-auto h-96 max-w-3xl animate-pulse rounded-panel bg-surface-sunken" />}>
        <OrderSuccess />
      </Suspense>
    </Container>
  );
}
