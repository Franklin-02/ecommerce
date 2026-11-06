import { BadgeCheck, Star } from "lucide-react";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/cn";
import { formatDate, formatNumber } from "@/lib/format";
import type { Product } from "@/types/catalog";
import type { Review } from "@/types/commerce";

function Stars({ value, className }: { value: number; className?: string }) {
  return (
    <span className="inline-flex gap-0.5" role="img" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} className={cn("size-4", className, star <= Math.round(value) ? "fill-star text-star" : "fill-surface-sunken text-surface-sunken")} aria-hidden />
      ))}
    </span>
  );
}

export function ProductReviews({ product, reviews }: { product: Product; reviews: Review[] }) {
  return (
    <section id="reviews" aria-labelledby="reviews-title" className="mt-14 scroll-mt-40">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[17rem_minmax(0,1fr)]">
          <div>
            <h2 id="reviews-title" className="text-2xl font-semibold tracking-tight text-ink-950">
              Customer reviews
            </h2>
            <p className="mt-4 text-5xl font-semibold tracking-tight text-ink-950">{product.rating.toFixed(1)}</p>
            <div className="mt-2">
              <Stars value={product.rating} className="size-5" />
            </div>
            <p className="mt-1.5 text-sm text-ink-500">Based on {formatNumber(product.reviewCount)} reviews</p>
          </div>
          <ul className="divide-y divide-line">
            {reviews.map((review) => (
              <li key={review.id} className="py-5 first:pt-0 last:pb-0">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <Stars value={review.rating} />
                  <h3 className="text-[0.9375rem] font-semibold text-ink-950">{review.title}</h3>
                </div>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-600">{review.body}</p>
                <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.8125rem] text-ink-500">
                  <span className="font-medium text-ink-800">{review.author}</span>
                  {review.verified && (
                    <span className="inline-flex items-center gap-1 text-success">
                      <BadgeCheck className="size-3.5" aria-hidden />
                      Verified purchase
                    </span>
                  )}
                  <span>{formatDate(review.date)}</span>
                  {review.helpful > 0 && <span>{review.helpful} found this helpful</span>}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
