import { ProductRail } from "@/components/product/product-rail";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import type { Product } from "@/types/catalog";

interface ProductSectionProps {
  id: string;
  eyebrow: string;
  title: string;
  href: string;
  products: Product[];
}

export function ProductSection({ id, eyebrow, title, href, products }: ProductSectionProps) {
  return (
    <section aria-labelledby={id} className="mt-14 lg:mt-16">
      <Container>
        <SectionHeader id={id} eyebrow={eyebrow} title={title} href={href} />
        <ProductRail products={products} label={title} />
      </Container>
    </section>
  );
}
