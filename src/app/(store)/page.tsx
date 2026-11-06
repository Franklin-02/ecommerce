import { BestSellers } from "@/components/home/best-sellers";
import { FeaturedCategories } from "@/components/home/featured-categories";
import { Hero } from "@/components/home/hero";
import { Newsletter } from "@/components/home/newsletter";
import { ProductSection } from "@/components/home/product-section";
import { PromoBanners } from "@/components/home/promo-banners";
import { RecommendedProducts } from "@/components/home/recommended-products";
import { SpecialOffers } from "@/components/home/special-offers";
import { TrustStrip } from "@/components/home/trust-strip";
import {
  getBestSellers,
  getCategories,
  getLatestArrivals,
  getSpecialOffers,
  getTopRatedProducts,
  getTrendingProducts,
} from "@/services/catalog";
import { getHomeContent } from "@/services/content";

export default async function HomePage() {
  const [content, categories, trending, bestSellers, latest, offers, topRated] = await Promise.all([
    getHomeContent(),
    getCategories(),
    getTrendingProducts(),
    getBestSellers(),
    getLatestArrivals(),
    getSpecialOffers(),
    getTopRatedProducts(10),
  ]);

  return (
    <>
      <Hero slides={content.heroSlides} tiles={content.heroTiles} />
      <TrustStrip points={content.trustPoints} />
      <FeaturedCategories categories={categories.filter((category) => category.featured)} />
      <ProductSection id="trending-title" eyebrow="What everyone's buying" title="Trending now" href="/trending" products={trending} />
      <PromoBanners banners={content.promoBanners} />
      <BestSellers products={bestSellers} />
      <SpecialOffers products={offers} />
      <ProductSection id="latest-title" eyebrow="Just landed" title="Latest arrivals" href="/new" products={latest} />
      <RecommendedProducts initial={topRated} />
      <Newsletter />
    </>
  );
}
