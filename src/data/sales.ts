import type { CategorySales, DailySales, Notification } from "@/types/commerce";
import { categories } from "./categories";
import { dayKey, daysAgo, seededRandom } from "./seed";

const HISTORY_DAYS = 180;
const random = seededRandom(5150);

/** Oldest first. Includes a weekend lift and steady growth into the holiday season. */
export const dailySales: DailySales[] = Array.from({ length: HISTORY_DAYS }, (_, index) => {
  const age = HISTORY_DAYS - 1 - index;
  const date = dayKey(age);
  const weekday = new Date(`${date}T00:00:00Z`).getUTCDay();
  const weekend = weekday === 0 || weekday === 6 ? 1.28 : 1;
  const growth = 1 + (index / HISTORY_DAYS) * 0.45;
  const noise = 0.85 + random() * 0.3;
  const orders = Math.round(88 * weekend * growth * noise);
  const averageOrder = 7600 + random() * 2400;
  return {
    date,
    orders,
    revenue: Math.round(orders * averageOrder),
    visitors: Math.round(orders * (34 + random() * 8)),
  };
});

const shares: Record<string, number> = {
  cat_phones: 0.27, cat_computing: 0.2, cat_audio: 0.13, cat_watches: 0.08,
  cat_networking: 0.07, cat_speakers: 0.06, cat_smart_home: 0.05, cat_power_banks: 0.04,
  cat_chargers: 0.04, cat_mobile_acc: 0.03, cat_lighting: 0.02, cat_electrical: 0.01,
};

const totalRevenue = dailySales.slice(-30).reduce((sum, day) => sum + day.revenue, 0);

export const categorySales: CategorySales[] = categories
  .map((category) => {
    const revenue = Math.round(totalRevenue * (shares[category.id] ?? 0));
    return {
      categoryId: category.id,
      name: category.shortName,
      revenue,
      units: Math.round(revenue / (category.id === "cat_phones" || category.id === "cat_computing" ? 62000 : 4800)),
    };
  })
  .sort((a, b) => b.revenue - a.revenue);

export const notifications: Notification[] = [
  { id: "ntf_001", title: "Low stock", body: "Resona Pebble Mini Speaker has 3 units left", at: daysAgo(0, 9, 12), kind: "stock" },
  { id: "ntf_002", title: "New high-value order", body: "OHM-104900 placed for over ₹50,000", at: daysAgo(0, 8, 40), kind: "order" },
  { id: "ntf_003", title: "Return requested", body: "A customer opened a return on OHM-104592", at: daysAgo(1, 16, 5), kind: "customer" },
  { id: "ntf_004", title: "Sold out", body: "Lumora Beam Desk Lamp is out of stock", at: daysAgo(1, 11, 30), kind: "stock" },
  { id: "ntf_005", title: "Promotion ending", body: "Deepavali Sale ends in 3 days", at: daysAgo(2, 10, 0), kind: "system" },
];
