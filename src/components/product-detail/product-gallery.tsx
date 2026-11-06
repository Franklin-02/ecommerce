"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";

export function ProductGallery({ images, name, soldOut }: { images: string[]; name: string; soldOut: boolean }) {
  const [index, setIndex] = useState(0);

  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row">
      <ul className="flex gap-2 sm:flex-col" aria-label="Product images">
        {images.map((image, imageIndex) => (
          <li key={image}>
            <button
              type="button"
              aria-label={`Show image ${imageIndex + 1} of ${images.length}`}
              aria-pressed={index === imageIndex}
              onClick={() => setIndex(imageIndex)}
              className={cn(
                "relative block size-16 overflow-hidden rounded-xl border-2 bg-surface-muted transition-colors sm:size-20",
                index === imageIndex ? "border-brand-600" : "border-transparent hover:border-line-strong",
              )}
            >
              <Image src={image} alt="" fill sizes="80px" className="object-contain p-1.5" />
            </button>
          </li>
        ))}
      </ul>
      <div className="relative aspect-square min-w-0 flex-1 overflow-hidden rounded-panel bg-surface-muted">
        <Image
          key={images[index]}
          src={images[index]}
          alt={index === 0 ? name : `${name}, close-up`}
          fill
          priority
          sizes="(min-width: 1024px) 45vw, 100vw"
          className={cn("animate-fade-up object-contain p-[7%]", soldOut && "opacity-50 grayscale")}
        />
      </div>
    </div>
  );
}
