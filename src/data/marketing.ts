import type { BannerSlot, Coupon, Promotion } from "@/types/commerce";
import { dayKey } from "./seed";

const art = (slug: string) => `/images/products/${slug}.svg`;

export const coupons: Coupon[] = [
  { id: "cpn_001", code: "WELCOME10", description: "10% off a first order", type: "percent", value: 10, minSpend: 0, usageCount: 1842, usageLimit: 5000, startsAt: dayKey(200), endsAt: dayKey(-120), status: "active" },
  { id: "cpn_002", code: "SAVE500", description: "₹500 off orders over ₹5,000", type: "fixed", value: 500, minSpend: 5000, usageCount: 624, usageLimit: 2000, startsAt: dayKey(40), endsAt: dayKey(-25), status: "active" },
  { id: "cpn_003", code: "FREESHIP", description: "Free delivery on any order", type: "shipping", value: 0, minSpend: 499, usageCount: 2310, usageLimit: 10000, startsAt: dayKey(90), endsAt: dayKey(-60), status: "active" },
  { id: "cpn_004", code: "PONGAL15", description: "15% off for Pongal", type: "percent", value: 15, minSpend: 2000, usageCount: 0, usageLimit: 3000, startsAt: dayKey(-64), endsAt: dayKey(-72), status: "scheduled" },
  { id: "cpn_005", code: "AADI15", description: "15% off in the Aadi Sale", type: "percent", value: 15, minSpend: 2000, usageCount: 3000, usageLimit: 3000, startsAt: dayKey(150), endsAt: dayKey(70), status: "expired" },
  { id: "cpn_006", code: "STUDENT200", description: "₹200 off for verified students", type: "fixed", value: 200, minSpend: 1500, usageCount: 198, usageLimit: 1000, startsAt: dayKey(60), endsAt: dayKey(-30), status: "paused" },
];

export const promotions: Promotion[] = [
  { id: "prm_001", name: "Deepavali Sale", kind: "Seasonal", discountLabel: "Up to 40% off", categoryIds: ["cat_phones", "cat_computing", "cat_audio", "cat_speakers"], startsAt: dayKey(14), endsAt: dayKey(-3), status: "active", revenue: 6840000 },
  { id: "prm_002", name: "Pongal Sale", kind: "Seasonal", discountLabel: "Up to 35% off", categoryIds: ["cat_phones", "cat_computing", "cat_audio"], startsAt: dayKey(-64), endsAt: dayKey(-72), status: "scheduled", revenue: 0 },
  { id: "prm_003", name: "Desk Setup Bundle", kind: "Bundle", discountLabel: "Save ₹2,000 on 3+ items", categoryIds: ["cat_computing"], startsAt: dayKey(30), endsAt: dayKey(-30), status: "active", revenue: 1486000 },
  { id: "prm_004", name: "Smart Home Starter", kind: "Bundle", discountLabel: "15% off bundles", categoryIds: ["cat_smart_home", "cat_lighting"], startsAt: dayKey(14), endsAt: dayKey(-16), status: "paused", revenue: 612000 },
  { id: "prm_005", name: "Aadi Sale", kind: "Seasonal", discountLabel: "Up to 30% off", categoryIds: ["cat_computing", "cat_chargers", "cat_lighting"], startsAt: dayKey(110), endsAt: dayKey(80), status: "expired", revenue: 9125000 },
  { id: "prm_006", name: "Last-Gen Clearance", kind: "Clearance", discountLabel: "Up to 50% off", categoryIds: ["cat_mobile_acc"], startsAt: dayKey(120), endsAt: dayKey(40), status: "expired", revenue: 1874000 },
];

export const banners: BannerSlot[] = [
  { id: "bnr_001", title: "Nova 9 Pro launch", placement: "Homepage hero", image: art("aurex-nova-9-pro"), href: "/product/aurex-nova-9-pro", startsAt: dayKey(20), endsAt: dayKey(-40), status: "active", clicks: 18420, impressions: 412000 },
  { id: "bnr_002", title: "Quiet One: save ₹7,000", placement: "Homepage hero", image: art("aurex-quiet-one-anc-headphones"), href: "/product/aurex-quiet-one-anc-headphones", startsAt: dayKey(10), endsAt: dayKey(-20), status: "active", clicks: 9640, impressions: 268000 },
  { id: "bnr_003", title: "WiFi 7 is here", placement: "Homepage hero", image: art("meshline-ax7-wifi-7-router"), href: "/product/meshline-ax7-wifi-7-router", startsAt: dayKey(10), endsAt: dayKey(-20), status: "active", clicks: 7120, impressions: 251000 },
  { id: "bnr_004", title: "Halo 2 wearables", placement: "Homepage tile", image: art("orbis-halo-2-smartwatch"), href: "/product/orbis-halo-2-smartwatch", startsAt: dayKey(30), endsAt: dayKey(-30), status: "active", clicks: 5230, impressions: 340000 },
  { id: "bnr_005", title: "Power banks up to 23% off", placement: "Homepage tile", image: art("voltaik-go-20000"), href: "/category/power-banks", startsAt: dayKey(30), endsAt: dayKey(-30), status: "active", clicks: 6410, impressions: 338000 },
  { id: "bnr_006", title: "The audio edit", placement: "Homepage promo", image: "/images/editorial/audio-studio.jpg", href: "/category/headphones-earbuds", startsAt: dayKey(15), endsAt: dayKey(-45), status: "active", clicks: 3890, impressions: 196000 },
  { id: "bnr_007", title: "Pongal Sale teaser", placement: "Homepage hero", image: art("tessel-pro-16-laptop"), href: "/deals", startsAt: dayKey(-58), endsAt: dayKey(-72), status: "scheduled", clicks: 0, impressions: 0 },
  { id: "bnr_008", title: "Lighting category header", placement: "Category header", image: "/images/editorial/lighting-pendant.jpg", href: "/category/lighting", startsAt: dayKey(120), endsAt: dayKey(30), status: "expired", clicks: 2140, impressions: 88000 },
];
