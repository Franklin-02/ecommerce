"use client";

import { Plus, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useState } from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { formatPrice } from "@/lib/pricing";
import { addToCart, openCartDrawer } from "@/stores/cart";
import { showToast } from "@/stores/toast";
import type { Product } from "@/types/catalog";

export function FrequentlyBought({ product, extras }: { product: Product; extras: Product[] }) {
  const items = [product, ...extras];
  const [selected, setSelected] = useState(() => new Set(items.map((item) => item.id)));
  const chosen = items.filter((item) => selected.has(item.id));
  const total = chosen.reduce((sum, item) => sum + item.price, 0);

  const toggle = (id: string) =>
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <section aria-labelledby="bought-together-title" className="mt-14">
      <Container>
        <h2 id="bought-together-title" className="mb-5 text-2xl font-semibold tracking-tight text-ink-950">
          Frequently bought together
        </h2>
        <div className="grid items-center gap-6 rounded-panel border border-line p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_17rem]">
          <ul className="grid grid-cols-1 gap-3 sm:flex sm:items-stretch">
            {items.map((item, index) => (
              <Fragment key={item.id}>
                {index > 0 && (
                  <li aria-hidden className="hidden items-center text-ink-400 sm:flex">
                    <Plus className="size-5" />
                  </li>
                )}
                <li className="flex items-center gap-3 sm:w-44 sm:flex-col sm:items-stretch sm:gap-2">
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-surface-muted sm:aspect-square sm:size-auto">
                    <Image src={item.images[0]} alt="" fill sizes="176px" className="object-contain p-2" />
                  </div>
                  <label className="flex min-w-0 flex-1 cursor-pointer items-start gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selected.has(item.id)}
                      onChange={() => toggle(item.id)}
                      aria-label={`Include ${item.name}`}
                      className="mt-0.5 size-4 shrink-0 accent-brand-600"
                    />
                    <span className="min-w-0">
                      {index === 0 ? (
                        <span className="line-clamp-2 leading-5 font-medium text-ink-950">This item: {item.name}</span>
                      ) : (
                        <Link href={`/product/${item.slug}`} className="line-clamp-2 leading-5 font-medium text-ink-950 hover:text-brand-600">
                          {item.name}
                        </Link>
                      )}
                      <span className="mt-0.5 block font-semibold text-ink-950">{formatPrice(item.price)}</span>
                    </span>
                  </label>
                </li>
              </Fragment>
            ))}
          </ul>
          <div className="border-t border-line pt-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
            <p className="text-sm text-ink-600">
              Total for {chosen.length} {chosen.length === 1 ? "item" : "items"}
            </p>
            <p className="mt-0.5 text-2xl font-semibold tracking-tight text-ink-950">{formatPrice(total)}</p>
            <Button
              className="mt-3 w-full"
              disabled={chosen.length === 0}
              onClick={() => {
                chosen.forEach((item) => addToCart(item));
                showToast(`${chosen.length} ${chosen.length === 1 ? "item" : "items"} added`, { label: "View cart", onClick: openCartDrawer });
              }}
            >
              <ShoppingBag className="size-4" aria-hidden />
              Add {chosen.length === items.length ? "all " : ""}to cart
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
