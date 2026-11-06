export interface HeroSlide {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  ctaLabel: string;
  href: string;
  image: string;
  imageAlt: string;
  priceNote: string;
  /** Spec callouts displayed under the copy. */
  stats: { value: string; label: string }[];
  theme: "navy" | "indigo" | "teal";
}

export interface HeroTile {
  id: string;
  eyebrow: string;
  title: string;
  href: string;
  image: string;
  imageAlt: string;
  theme: "sky" | "amber";
}

export interface PromoBanner {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  ctaLabel: string;
  href: string;
  image: string;
  imageAlt: string;
}

export type TrustIcon = "truck" | "shield" | "rotate" | "headset";

export interface TrustPoint {
  icon: TrustIcon;
  title: string;
  body: string;
}

export interface HomeContent {
  heroSlides: HeroSlide[];
  heroTiles: HeroTile[];
  promoBanners: PromoBanner[];
  trustPoints: TrustPoint[];
}

export interface NavLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: NavLink[];
}
