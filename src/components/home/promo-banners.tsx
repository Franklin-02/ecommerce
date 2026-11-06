import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/cn";
import type { PromoBanner } from "@/types/content";

export function PromoBanners({ banners }: { banners: PromoBanner[] }) {
  return (
    <Container className="mt-14 lg:mt-16">
      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {banners.map((banner, index) => (
          <li key={banner.id} className={cn(index === 0 && "md:col-span-2")}>
            <Link href={banner.href} className="group relative flex h-80 flex-col justify-end overflow-hidden rounded-panel bg-ink-950 p-6 text-white sm:p-7">
              <Image
                src={banner.image}
                alt={banner.imageAlt}
                fill
                sizes={index === 0 ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/35 to-transparent" aria-hidden />
              <span className="relative">
                <span className="eyebrow block text-white/80">{banner.eyebrow}</span>
                <span className="mt-1.5 block max-w-sm text-2xl leading-7 font-semibold tracking-tight">{banner.title}</span>
                <span className="mt-1.5 block max-w-sm text-sm text-white/80">{banner.body}</span>
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold">
                  {banner.ctaLabel}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}
