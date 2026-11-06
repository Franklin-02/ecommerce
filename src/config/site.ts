import type { FooterColumn, NavLink } from "@/types/content";

/** Brand and locale settings. Rebranding the prototype starts here. */
export const siteConfig = {
  name: "Ohmly",
  tagline: "Electronics, properly sourced.",
  description:
    "Phones, audio, laptops, smart home and everything that powers them, from Chennai to Kanyakumari, with 2-year warranties and next-day delivery across Tamil Nadu.",
  locale: "en-IN",
  currency: "INR",
  timeZone: "Asia/Kolkata",
  /** The seller's registered state. Decides CGST + SGST or IGST, and where next-day delivery runs. */
  homeState: "Tamil Nadu",
  /** Sample GSTIN (33 is Tamil Nadu's state code). Replace with the real registration. */
  gstin: "33AABCO1234C1Z5",
  freeDeliveryThreshold: 999,
  /** Smallest order eligible for no-cost EMI, and the plan length shown. */
  emiMinimum: 3000,
  emiMonths: 6,
  supportPhone: "1800 555 0142",
  supportEmail: "help@ohmly.example",
};

export const announcements: { text: string; lang?: string }[] = [
  { text: `Free delivery on orders over ₹${siteConfig.freeDeliveryThreshold}` },
  { text: "வணக்கம் தமிழ்நாடு!", lang: "ta" },
  { text: "Next-day delivery across Tamil Nadu" },
  { text: "UPI, no-cost EMI and cash on delivery" },
];

export const indianStates = [
  "Tamil Nadu", "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh",
  "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh",
  "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra",
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

export const utilityLinks: NavLink[] = [
  { label: "Track order", href: "/account/orders" },
  { label: "Help centre", href: "/help" },
  { label: "Store finder", href: "/stores" },
];

export const primaryNav: NavLink[] = [
  { label: "Smartphones", href: "/category/smartphones" },
  { label: "Audio", href: "/category/headphones-earbuds" },
  { label: "Laptops", href: "/category/laptops-computer-accessories" },
  { label: "Smart Watches", href: "/category/smart-watches" },
  { label: "Smart Home", href: "/category/smart-home-devices" },
  { label: "Power Banks", href: "/category/power-banks" },
  { label: "Networking", href: "/category/networking-products" },
];

export const footerColumns: FooterColumn[] = [
  {
    title: "Shop",
    links: [
      { label: "All categories", href: "/categories" },
      { label: "Today's offers", href: "/deals" },
      { label: "New arrivals", href: "/new" },
      { label: "Best sellers", href: "/best-sellers" },
      { label: "Gift cards", href: "/gift-cards" },
    ],
  },
  {
    title: "Customer care",
    links: [
      { label: "Help centre", href: "/help" },
      { label: "Track your order", href: "/account/orders" },
      { label: "Delivery options", href: "/help/delivery" },
      { label: "Returns & refunds", href: "/help/returns" },
      { label: "Warranty claims", href: "/help/warranty" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Ohmly", href: "/about" },
      { label: "Store finder", href: "/stores" },
      { label: "Business accounts", href: "/business" },
      { label: "Careers", href: "/careers" },
      { label: "Recycle your device", href: "/recycle" },
    ],
  },
];

export const legalLinks: NavLink[] = [
  { label: "Privacy", href: "/legal/privacy" },
  { label: "Terms", href: "/legal/terms" },
  { label: "Cookies", href: "/legal/cookies" },
  { label: "Accessibility", href: "/legal/accessibility" },
];

export const paymentMethods = ["UPI", "Credit card", "Debit card", "Net banking", "No-cost EMI", "Cash on delivery"];
