import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import type { HeroSlide, HeroTile } from "@/types/content";
import { HeroCarousel } from "./hero-carousel";

const tileThemes: Record<HeroTile["theme"], string> = {
  sky: "bg-tint-blue",
  amber: "bg-tint-amber",
};

export function Hero({ slides, tiles }: { slides: HeroSlide[]; tiles: HeroTile[] }) {
  return (
    <Container className="pt-4 lg:pt-5">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,2.6fr)_minmax(0,1fr)]">
        <HeroCarousel slides={slides} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {tiles.map((tile) => (
            <Link
              key={tile.id}
              href={tile.href}
              className={`group relative flex min-h-52 flex-col overflow-hidden rounded-panel p-6 ${tileThemes[tile.theme]}`}
            >
              <p className="eyebrow text-ink-600">{tile.eyebrow}</p>
              <h2 className="mt-2 max-w-[11rem] text-xl leading-6 font-semibold tracking-tight text-ink-950">{tile.title}</h2>
              <span className="mt-auto grid size-9 place-items-center rounded-full bg-white text-ink-950 transition-colors group-hover:bg-ink-950 group-hover:text-white">
                <ArrowUpRight className="size-4" aria-hidden />
              </span>
              <Image
                src={tile.image}
                alt={tile.imageAlt}
                width={220}
                height={220}
                className="absolute -right-4 -bottom-4 size-44 object-contain transition-transform duration-500 group-hover:scale-105 xl:size-52"
              />
            </Link>
          ))}
        </div>
      </div>
    </Container>
  );
}
