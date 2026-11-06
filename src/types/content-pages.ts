import type { NavLink } from "./content";

export interface ContentSection {
  heading: string;
  body?: string[];
  bullets?: string[];
}

export interface ContentCard {
  title: string;
  body: string;
  href?: string;
}

export interface ContentFaq {
  question: string;
  answer: string;
}

export interface StoreLocation {
  name: string;
  address: string;
  phone: string;
  hours: string;
  services: string[];
}

export interface ContentPage {
  eyebrow: string;
  title: string;
  intro: string;
  /** Short notice displayed above the page content. */
  note?: string;
  sections: ContentSection[];
  cards?: ContentCard[];
  faqs?: ContentFaq[];
  locations?: StoreLocation[];
  related?: NavLink[];
}
