import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/pricing";

interface PriceProps {
  price: number;
  compareAtPrice?: number;
  size?: "md" | "lg";
}

export function Price({ price, compareAtPrice, size = "md" }: PriceProps) {
  return (
    <p className="flex flex-wrap items-baseline gap-x-1.5">
      <span className={cn("font-semibold tracking-tight text-ink-950", size === "lg" ? "text-2xl" : "text-lg")}>
        <span className="sr-only">{compareAtPrice ? "Sale price " : "Price "}</span>
        {formatPrice(price)}
      </span>
      {compareAtPrice && (
        <span className="text-[0.8125rem] text-ink-500">
          <span className={size === "lg" ? "" : "sr-only"}>M.R.P. </span>
          <s>{formatPrice(compareAtPrice)}</s>
        </span>
      )}
    </p>
  );
}
