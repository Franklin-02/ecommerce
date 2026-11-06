import type { Metadata } from "next";
import { CartView } from "@/components/cart/cart-view";
import { Breadcrumbs } from "@/components/catalog/breadcrumbs";
import { RecommendedProducts } from "@/components/home/recommended-products";
import { Container } from "@/components/ui/container";
import { getTopRatedProducts } from "@/services/catalog";

export const metadata: Metadata = { title: "Your cart" };

export default async function CartPage() {
  return (
    <div className="pb-16">
      <Container className="pt-4">
        <Breadcrumbs items={[{ label: "Cart" }]} />
        <h1 className="mt-3 mb-6 text-3xl font-semibold tracking-tight text-ink-950 sm:text-4xl">Your cart</h1>
        <CartView />
      </Container>
      <RecommendedProducts initial={await getTopRatedProducts(10)} />
    </div>
  );
}
