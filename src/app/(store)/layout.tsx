import { StoreGate } from "@/components/auth/gates";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Toaster } from "@/components/ui/toaster";
import { getCategories } from "@/services/catalog";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const categories = await getCategories();
  return (
    <StoreGate>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[70] focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2 focus:shadow-overlay"
      >
        Skip to content
      </a>
      <AnnouncementBar />
      <Header categories={categories} />
      <main id="main">{children}</main>
      <Footer />
      <CartDrawer />
      <Toaster />
    </StoreGate>
  );
}
