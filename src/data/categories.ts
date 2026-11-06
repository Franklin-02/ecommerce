import type { Brand, Category } from "@/types/catalog";

const art = (slug: string) => `/images/products/${slug}.svg`;

/** Adding a category here is all that's needed for it to appear across the storefront. */
export const categories: Category[] = [
  { id: "cat_phones", slug: "smartphones", name: "Smartphones", shortName: "Phones", icon: "smartphone", tint: "blue", featured: true, image: art("aurex-nova-9-pro"), description: "Flagship cameras, all-day batteries and dual-SIM 5G handsets from the brands worth carrying." },
  { id: "cat_mobile_acc", slug: "mobile-accessories", name: "Mobile Accessories", shortName: "Accessories", icon: "accessories", tint: "violet", featured: true, image: art("pivot-magring-clear-case"), description: "Cases, screen protection and stands that keep your phone looking the way it did on day one." },
  { id: "cat_chargers", slug: "chargers-cables", name: "Chargers & Cables", shortName: "Chargers", icon: "cable", tint: "slate", featured: true, image: art("fluxon-gan-65w-charger"), description: "GaN fast chargers, wireless stands and braided cables rated for real-world wear." },
  { id: "cat_power_banks", slug: "power-banks", name: "Power Banks", shortName: "Power Banks", icon: "battery", tint: "amber", featured: true, image: art("voltaik-go-20000"), description: "Portable power for travel and power cuts, from pocket-sized magnetic packs to laptop-class batteries." },
  { id: "cat_audio", slug: "headphones-earbuds", name: "Headphones & Earbuds", shortName: "Audio", icon: "headphones", tint: "rose", featured: true, image: art("aurex-quiet-one-anc-headphones"), description: "Noise-cancelling over-ears, studio monitors and true wireless earbuds." },
  { id: "cat_speakers", slug: "speakers", name: "Speakers", shortName: "Speakers", icon: "speaker", tint: "blue", featured: true, image: art("resona-roam-portable-speaker"), description: "Portable, smart and home theatre sound that fills the room without the clutter." },
  { id: "cat_computing", slug: "laptops-computer-accessories", name: "Laptops & Computer Accessories", shortName: "Laptops", icon: "laptop", tint: "violet", featured: true, image: art("tessel-air-14-laptop"), description: "Thin-and-light laptops plus the keyboards, mice and docks that complete a desk." },
  { id: "cat_watches", slug: "smart-watches", name: "Smart Watches", shortName: "Watches", icon: "watch", tint: "teal", featured: true, image: art("orbis-halo-2-smartwatch"), description: "Health tracking, GPS and notifications on your wrist, from fitness bands to rugged outdoor watches." },
  { id: "cat_electrical", slug: "electrical-accessories", name: "Electrical Accessories", shortName: "Electrical", icon: "plug", tint: "slate", featured: true, image: art("ferro-guard-6-surge-strip"), description: "Surge protection, power strips and travel adapters, BIS certified and built for Indian mains." },
  { id: "cat_lighting", slug: "lighting", name: "Lighting", shortName: "Lighting", icon: "lightbulb", tint: "amber", featured: true, image: art("lumora-colour-b22-smart-bulb"), description: "Smart bulbs, LED strips and task lamps for every room and every mood." },
  { id: "cat_smart_home", slug: "smart-home-devices", name: "Smart Home Devices", shortName: "Smart Home", icon: "home", tint: "teal", featured: true, image: art("nestwell-climate-ac-controller"), description: "Cameras, doorbells, plugs and AC controllers that work together from one app." },
  { id: "cat_networking", slug: "networking-products", name: "Networking Products", shortName: "Networking", icon: "router", tint: "rose", featured: true, image: art("meshline-ax7-wifi-7-router"), description: "WiFi 7 routers, mesh systems and switches for faster, wall-to-wall coverage." },
];

export const brands: Brand[] = [
  { id: "brand_aurex", slug: "aurex", name: "Aurex" },
  { id: "brand_kestrel", slug: "kestrel", name: "Kestrel" },
  { id: "brand_pivot", slug: "pivot", name: "Pivot" },
  { id: "brand_fluxon", slug: "fluxon", name: "Fluxon" },
  { id: "brand_voltaik", slug: "voltaik", name: "Voltaik" },
  { id: "brand_resona", slug: "resona", name: "Resona" },
  { id: "brand_tessel", slug: "tessel", name: "Tessel" },
  { id: "brand_orbis", slug: "orbis", name: "Orbis" },
  { id: "brand_ferro", slug: "ferro", name: "Ferro" },
  { id: "brand_lumora", slug: "lumora", name: "Lumora" },
  { id: "brand_nestwell", slug: "nestwell", name: "Nestwell" },
  { id: "brand_meshline", slug: "meshline", name: "Meshline" },
];
