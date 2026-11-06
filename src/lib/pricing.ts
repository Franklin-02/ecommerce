import { siteConfig } from "@/config/site";
import type { Product } from "@/types/catalog";

const options = { style: "currency", currency: siteConfig.currency } as const;
const wholeCurrency = new Intl.NumberFormat(siteConfig.locale, { ...options, maximumFractionDigits: 0 });
const exactCurrency = new Intl.NumberFormat(siteConfig.locale, options);

/** Whole amounts drop the paise (₹2,499); anything else always shows two places (₹699.90). */
export const formatPrice = (amount: number) =>
  (Number.isInteger(amount) ? wholeCurrency : exactCurrency).format(amount);

export function discountPercent(product: Pick<Product, "price" | "compareAtPrice">) {
  const { price, compareAtPrice } = product;
  if (!compareAtPrice || compareAtPrice <= price) return 0;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}
