"use client";

import { Heart, Menu, Tag, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CategoryIcon } from "@/components/ui/category-icon";
import { Drawer } from "@/components/ui/drawer";
import { utilityLinks } from "@/config/site";
import type { Category } from "@/types/catalog";
import { Logo } from "./logo";

export function MobileNav({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const row = "flex items-center gap-3 rounded-xl px-3 py-3 text-[0.9375rem] font-medium text-ink-950 hover:bg-surface-muted";

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="-ml-2 grid size-10 place-items-center rounded-full text-ink-900 hover:bg-surface-sunken lg:hidden"
      >
        <Menu className="size-6" aria-hidden />
      </button>

      <Drawer open={open} onClose={close} side="left" label="Menu" title={<Logo />}>
        <nav aria-label="Mobile" className="flex-1 overflow-y-auto p-3">
          <Link href="/deals" onClick={close} className={`${row} text-deal`}>
            <Tag className="size-5" aria-hidden /> Today&apos;s offers
          </Link>
          <p className="eyebrow mt-3 mb-1 px-3 text-ink-500">Shop by category</p>
          <ul>
            {categories.map((category) => (
              <li key={category.id}>
                <Link href={`/category/${category.slug}`} onClick={close} className={row}>
                  <CategoryIcon name={category.icon} className="size-5 text-brand-600" />
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-3 border-t border-line pt-3">
            <Link href="/account" onClick={close} className={row}>
              <User className="size-5" aria-hidden /> My account
            </Link>
            <Link href="/account/wishlist" onClick={close} className={row}>
              <Heart className="size-5" aria-hidden /> Wishlist
            </Link>
            {utilityLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={close} className={`${row} font-normal text-ink-600`}>
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      </Drawer>
    </>
  );
}
