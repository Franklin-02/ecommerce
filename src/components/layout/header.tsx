import { Tag } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { primaryNav } from "@/config/site";
import type { Category } from "@/types/catalog";
import { CategoryMenu } from "./category-menu";
import { HeaderActions } from "./header-actions";
import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";
import { SearchBar } from "./search-bar";

export function Header({ categories }: { categories: Category[] }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur">
      <Container className="flex flex-wrap items-center gap-x-3 gap-y-2 py-2.5 lg:flex-nowrap lg:gap-x-8 lg:py-3">
        <MobileNav categories={categories} />
        <Logo className="mr-auto lg:mr-0" />
        <SearchBar className="order-last w-full lg:order-none lg:mx-auto lg:max-w-2xl lg:flex-1" />
        <HeaderActions />
      </Container>

      <div className="relative hidden border-t border-line lg:block">
        <Container className="flex items-center gap-6">
          <CategoryMenu categories={categories} />
          <span className="h-5 w-px bg-line-strong" aria-hidden />
          <nav aria-label="Primary" className="flex flex-1 items-center gap-6">
            {primaryNav.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm whitespace-nowrap text-ink-600 transition-colors hover:text-ink-950">
                {link.label}
              </Link>
            ))}
          </nav>
          <Link href="/deals" className="flex items-center gap-1.5 text-sm font-semibold whitespace-nowrap text-deal hover:opacity-80">
            <Tag className="size-4" aria-hidden />
            Today&apos;s offers
          </Link>
        </Container>
      </div>
    </header>
  );
}
