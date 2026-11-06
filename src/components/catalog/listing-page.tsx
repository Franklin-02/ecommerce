import Image from "next/image";
import { Suspense, type ComponentProps, type ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { getCategories } from "@/services/catalog";
import type { Category } from "@/types/catalog";
import { Breadcrumbs, type Crumb } from "./breadcrumbs";
import { ProductListing } from "./product-listing";

type ListingProps = Pick<ComponentProps<typeof ProductListing>, "products" | "categoryNames" | "emptyTitle" | "emptyBody" | "emptyAction">;

interface ListingFrameProps extends ListingProps {
  crumbs: Crumb[];
  title: string;
  description: string;
  /** Turns the heading into a tinted banner. */
  banner?: { image: string; tint: Category["tint"] };
  /** Content between the heading and the products. */
  children?: ReactNode;
}

interface ListingPageProps extends Omit<ListingFrameProps, "categoryNames"> {
  /** Show the category filter. Use on listings that span categories. */
  acrossCategories?: boolean;
}

function ListingFallback() {
  return (
    <div className="grid gap-8 lg:grid-cols-[15.5rem_minmax(0,1fr)]" aria-busy="true" aria-label="Loading products">
      <div className="hidden h-96 animate-pulse rounded-card bg-surface-sunken lg:block" />
      <div className="grid animate-pulse grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index} className="aspect-[3/4] rounded-card bg-surface-sunken" />
        ))}
      </div>
    </div>
  );
}

/** Placeholder for a listing whose products are still on their way. */
export function ListingLoading() {
  return (
    <Container className="pt-4 pb-16">
      <ListingFallback />
    </Container>
  );
}

/** Loads the category names for listings that span categories. */
export async function ListingPage({ acrossCategories, ...frame }: ListingPageProps) {
  const categoryNames = acrossCategories
    ? Object.fromEntries((await getCategories()).map((category) => [category.id, category.name]))
    : undefined;

  return <ListingFrame {...frame} categoryNames={categoryNames} />;
}

/** Page frame shared by every product listing route. */
export function ListingFrame({ crumbs, title, description, banner, children, ...listing }: ListingFrameProps) {
  return (
    <Container className="pt-4 pb-16">
      <Breadcrumbs items={crumbs} />
      {banner ? (
        <header
          className="relative mt-3 mb-6 flex min-h-36 items-center overflow-hidden rounded-panel p-6 sm:min-h-44 sm:p-8"
          style={{ background: `var(--color-tint-${banner.tint})` }}
        >
          <div className="relative z-10 max-w-[62%] sm:max-w-xl">
            <h1 className="text-[1.75rem] leading-8 font-semibold tracking-tight text-ink-950 sm:text-4xl sm:leading-10">{title}</h1>
            <p className="mt-2 text-sm leading-5 text-ink-600 sm:text-base sm:leading-6">{description}</p>
          </div>
          <Image src={banner.image} alt="" width={240} height={240} priority className="absolute -right-3 -bottom-6 size-40 object-contain sm:right-8 sm:size-56" />
        </header>
      ) : (
        <header className="mt-3 mb-6">
          <h1 className="text-3xl font-semibold tracking-tight text-ink-950 sm:text-4xl">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-600 sm:text-base">{description}</p>
        </header>
      )}
      {children}
      <Suspense fallback={<ListingFallback />}>
        <ProductListing {...listing} />
      </Suspense>
    </Container>
  );
}
