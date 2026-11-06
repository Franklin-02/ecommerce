import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/catalog/breadcrumbs";
import { CheckoutView } from "@/components/checkout/checkout-view";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <Container className="pt-4 pb-16">
      <Breadcrumbs items={[{ label: "Cart", href: "/cart" }, { label: "Checkout" }]} />
      <h1 className="mt-3 mb-6 text-3xl font-semibold tracking-tight text-ink-950 sm:text-4xl">Checkout</h1>
      <CheckoutView />
    </Container>
  );
}
