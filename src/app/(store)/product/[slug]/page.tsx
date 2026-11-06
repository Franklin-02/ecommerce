import { Check, RotateCcw, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/catalog/breadcrumbs";
import { ProductSection } from "@/components/home/product-section";
import { DeliveryCheck } from "@/components/product-detail/delivery-check";
import { FrequentlyBought } from "@/components/product-detail/frequently-bought";
import { ProductGallery } from "@/components/product-detail/product-gallery";
import { ProductReviews } from "@/components/product-detail/product-reviews";
import { PurchasePanel } from "@/components/product-detail/purchase-panel";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { Price } from "@/components/ui/price";
import { Rating } from "@/components/ui/rating";
import { StatusBadge } from "@/components/ui/status-badge";
import { siteConfig } from "@/config/site";
import { discountPercent, formatPrice } from "@/lib/pricing";
import {
  getCatalogProducts,
  getCategories,
  getFrequentlyBoughtTogether,
  getProductBySlug,
  getRelatedProducts,
} from "@/services/catalog";
import { getProductReviews } from "@/services/operations";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const LOW_STOCK = 10;

export async function generateStaticParams() {
  return (await getCatalogProducts()).map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await getProductBySlug((await params).slug);
  return product ? { title: product.name, description: product.summary } : {};
}

export default async function ProductPage({ params }: PageProps) {
  const product = await getProductBySlug((await params).slug);
  if (!product) notFound();

  const [categories, reviews, related, together] = await Promise.all([
    getCategories(),
    getProductReviews(product.id),
    getRelatedProducts(product),
    getFrequentlyBoughtTogether(product),
  ]);
  const category = categories.find((candidate) => candidate.id === product.categoryId);
  const discount = discountPercent(product);
  const soldOut = product.stock === 0;

  return (
    <div className="pb-16">
      <Container className="pt-4">
        <Breadcrumbs
          items={[
            ...(category ? [{ label: category.name, href: `/category/${category.slug}` }] : []),
            { label: product.name },
          ]}
        />

        <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-12">
          <div className="lg:sticky lg:top-36 lg:self-start">
            <ProductGallery images={product.images} name={product.name} soldOut={soldOut} />
          </div>

          <div className="min-w-0">
            <Link href={`/categories?brand=${product.brandName}`} className="eyebrow text-brand-600 hover:underline">
              {product.brandName}
            </Link>
            <h1 className="mt-1.5 text-3xl leading-tight font-semibold tracking-tight text-ink-950 sm:text-4xl">{product.name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
              <a href="#reviews" className="hover:underline">
                <Rating value={product.rating} count={product.reviewCount} />
              </a>
              <span className="font-mono text-xs text-ink-500">SKU {product.sku}</span>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Price price={product.price} compareAtPrice={product.compareAtPrice} size="lg" />
              {discount > 0 && product.compareAtPrice && (
                <Badge tone="deal">
                  Save {formatPrice(product.compareAtPrice - product.price)} (-{discount}%)
                </Badge>
              )}
            </div>
            <p className="mt-1.5 text-[0.8125rem] text-ink-500">
              Inclusive of all taxes
              {product.price >= siteConfig.emiMinimum &&
                ` · No-cost EMI from ${formatPrice(Math.ceil(product.price / siteConfig.emiMonths))}/month`}
            </p>
            <div className="mt-3">
              {soldOut ? (
                <StatusBadge label="Out of stock" tone="danger" />
              ) : product.stock <= LOW_STOCK ? (
                <StatusBadge label={`Only ${product.stock} left`} tone="warning" />
              ) : (
                <StatusBadge label="In stock, ready to ship" tone="success" />
              )}
            </div>

            <p className="mt-5 text-base leading-7 text-ink-600">{product.summary}</p>
            <ul className="mt-4 space-y-1.5">
              {product.highlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-2 text-sm text-ink-800">
                  <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
                  {highlight}
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <PurchasePanel product={product} />
            </div>
            <div className="mt-5">
              <DeliveryCheck />
            </div>
            <ul className="mt-4 grid gap-2 text-sm text-ink-600 sm:grid-cols-2">
              <li className="flex items-center gap-2">
                <ShieldCheck className="size-4 shrink-0 text-brand-600" aria-hidden />
                {product.warrantyMonths / 12}-year warranty included
              </li>
              <li className="flex items-center gap-2">
                <RotateCcw className="size-4 shrink-0 text-brand-600" aria-hidden />
                Free 30-day returns
              </li>
            </ul>
          </div>
        </div>
      </Container>

      <section aria-labelledby="specs-title" className="mt-14">
        <Container>
          <h2 id="specs-title" className="mb-5 text-2xl font-semibold tracking-tight text-ink-950">
            Specifications
          </h2>
          <dl className="grid gap-x-10 rounded-panel border border-line px-5 py-2 sm:px-6 md:grid-cols-2">
            {Object.entries(product.specs).map(([name, value]) => (
              <div key={name} className="flex justify-between gap-6 border-b border-line py-3 text-sm last:border-0 md:[&:nth-last-child(2):nth-child(odd)]:border-0">
                <dt className="text-ink-500">{name}</dt>
                <dd className="text-right font-medium text-ink-950">{value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {!soldOut && together.length > 0 && <FrequentlyBought product={product} extras={together} />}
      <ProductReviews product={product} reviews={reviews} />
      {related.length > 0 && (
        <ProductSection
          id="related-title"
          eyebrow={category ? `More in ${category.shortName}` : "You may also like"}
          title="Related products"
          href={category ? `/category/${category.slug}` : "/categories"}
          products={related}
        />
      )}
    </div>
  );
}
