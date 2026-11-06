import { siteConfig } from "@/config/site";

const { locale, timeZone } = siteConfig;

const dateFormat = new Intl.DateTimeFormat(locale, { month: "short", day: "numeric", year: "numeric", timeZone });
const shortDateFormat = new Intl.DateTimeFormat(locale, { month: "short", day: "numeric", timeZone });
const dateTimeFormat = new Intl.DateTimeFormat(locale, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZone });
const numberFormat = new Intl.NumberFormat(locale);

/** Dates use a fixed time zone so server and client render identical text. */
export const formatDate = (iso: string) => dateFormat.format(new Date(iso));
export const formatShortDate = (iso: string) => shortDateFormat.format(new Date(iso));
export const formatDateTime = (iso: string) => dateTimeFormat.format(new Date(iso));
export const formatNumber = (value: number) => numberFormat.format(value);

const trim = (value: number) => String(Math.round(value * 10) / 10);

/** Indian compact notation: 45K, 3.5L, 1.2Cr. */
export function formatCompact(value: number) {
  if (Math.abs(value) >= 1e7) return `${trim(value / 1e7)}Cr`;
  if (Math.abs(value) >= 1e5) return `${trim(value / 1e5)}L`;
  if (Math.abs(value) >= 1e3) return `${trim(value / 1e3)}K`;
  return trim(value);
}

export const formatCompactPrice = (value: number) => `₹${formatCompact(value)}`;

export const initials = (name: string) =>
  name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase();
