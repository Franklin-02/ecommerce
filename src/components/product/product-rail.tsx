"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Product } from "@/types/catalog";
import { ProductCard } from "./product-card";

/** Horizontally scrolling product row: swipe on touch, arrows on desktop. */
export function ProductRail({ products, label }: { products: Product[]; label: string }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () =>
      setEdges({
        start: track.scrollLeft <= 4,
        end: track.scrollLeft + track.clientWidth >= track.scrollWidth - 4,
      });
    track.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(track);
    return () => {
      track.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, []);

  const scroll = (direction: 1 | -1) => {
    const track = trackRef.current;
    track?.scrollBy({ left: direction * track.clientWidth * 0.85, behavior: "smooth" });
  };

  const arrow =
    "absolute top-[38%] z-20 hidden size-11 -translate-y-1/2 place-items-center rounded-full border border-line bg-surface text-ink-900 shadow-card transition-opacity hover:border-ink-900 disabled:pointer-events-none disabled:opacity-0 md:grid";

  return (
    <div className="relative">
      <ul
        ref={trackRef}
        aria-label={label}
        className="scrollbar-none -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 py-1 sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:scroll-px-0 lg:px-0"
      >
        {products.map((product) => (
          <li key={product.id} className="w-[68%] shrink-0 snap-start sm:w-[42%] md:w-[31%] lg:w-[23.5%] xl:w-[19%]">
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
      <button type="button" aria-label={`Previous ${label}`} disabled={edges.start} onClick={() => scroll(-1)} className={`${arrow} -left-3`}>
        <ChevronLeft className="size-5" aria-hidden />
      </button>
      <button type="button" aria-label={`Next ${label}`} disabled={edges.end} onClick={() => scroll(1)} className={`${arrow} -right-3`}>
        <ChevronRight className="size-5" aria-hidden />
      </button>
    </div>
  );
}
