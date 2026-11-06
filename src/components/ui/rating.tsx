import { Star } from "lucide-react";

export function Rating({ value, count }: { value: number; count: number }) {
  return (
    <p
      className="flex items-center gap-1 text-[0.8125rem] text-ink-500"
      aria-label={`Rated ${value} out of 5 from ${count.toLocaleString("en-IN")} reviews`}
    >
      <Star className="size-3.5 fill-star text-star" aria-hidden />
      <span className="font-semibold text-ink-800">{value.toFixed(1)}</span>
      <span>({count.toLocaleString("en-IN")})</span>
    </p>
  );
}
