"use client";

import { ChevronDown, LayoutGrid } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CategoryIcon } from "@/components/ui/category-icon";
import { cn } from "@/lib/cn";
import type { Category } from "@/types/catalog";

export function CategoryMenu({ categories }: { categories: Category[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="category-menu"
        onClick={() => setOpen((value) => !value)}
        className="flex h-11 items-center gap-2 pr-1 text-sm font-semibold text-ink-950 hover:text-brand-600"
      >
        <LayoutGrid className="size-4" aria-hidden />
        All categories
        <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} aria-hidden />
      </button>

      <div
        id="category-menu"
        hidden={!open}
        className="absolute inset-x-0 top-full z-40 border-t border-line bg-surface shadow-overlay"
      >
        <ul className="mx-auto grid max-w-[90rem] grid-cols-3 gap-1 p-5 lg:px-8 xl:grid-cols-4">
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                href={`/category/${category.slug}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl p-3 hover:bg-surface-muted"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600">
                  <CategoryIcon name={category.icon} className="size-5" />
                </span>
                <span className="text-sm font-medium text-ink-950">{category.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
