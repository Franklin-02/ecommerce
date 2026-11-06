"use client";

import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import type { HeroSlide } from "@/types/content";

const INTERVAL_MS = 6500;

const themes: Record<HeroSlide["theme"], string> = {
  navy: "from-ink-950 via-ink-900 to-[#1b2a6b]",
  indigo: "from-[#17125a] via-[#2a22a0] to-brand-500",
  teal: "from-[#04262e] via-[#07444a] to-[#0d7a74]",
};

export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (paused || hovering || reducedMotion) return;
    const timer = setInterval(() => setIndex((value) => (value + 1) % slides.length), INTERVAL_MS);
    return () => clearInterval(timer);
  }, [paused, hovering, slides.length]);

  const step = (delta: number) => setIndex((value) => (value + delta + slides.length) % slides.length);
  const control = "grid size-9 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20";

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured products"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className="relative grid overflow-hidden rounded-panel bg-ink-950"
    >
      {slides.map((slide, slideIndex) => {
        const active = slideIndex === index;
        return (
          <div
            key={slide.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${slideIndex + 1} of ${slides.length}`}
            aria-hidden={!active}
            inert={!active}
            className={cn(
              "col-start-1 row-start-1 grid bg-gradient-to-br text-white transition-opacity duration-700 md:grid-cols-[1.1fr_1fr]",
              themes[slide.theme],
              active ? "opacity-100" : "opacity-0",
            )}
          >
            <div className="flex flex-col justify-center px-6 pt-8 pb-2 sm:px-10 md:py-14 md:pb-20 lg:pl-12">
              <p className="eyebrow text-brand-300">{slide.eyebrow}</p>
              <h1 className="mt-3 text-[2.125rem] leading-[1.06] font-semibold tracking-tight text-balance sm:text-5xl xl:text-[3.5rem]">
                {slide.title}
              </h1>
              <p className="mt-4 max-w-md text-base leading-6 text-white/75">{slide.body}</p>
              <dl className="mt-6 flex gap-6 sm:gap-8">
                {slide.stats.map((stat) => (
                  <div key={stat.label}>
                    <dd className="font-mono text-lg font-medium sm:text-xl">{stat.value}</dd>
                    <dt className="mt-0.5 text-xs text-white/65">{stat.label}</dt>
                  </div>
                ))}
              </dl>
              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
                <ButtonLink href={slide.href} variant="inverse" size="lg">
                  {slide.ctaLabel}
                  <ArrowRight className="size-4" aria-hidden />
                </ButtonLink>
                <p className="text-sm text-white/75">{slide.priceNote}</p>
              </div>
            </div>
            <div className="relative h-64 sm:h-80 md:h-auto">
              <div className="absolute top-1/2 left-1/2 size-[85%] max-h-[26rem] max-w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" aria-hidden />
              <Image
                src={slide.image}
                alt={slide.imageAlt}
                fill
                priority={slideIndex === 0}
                sizes="(min-width: 1024px) 34vw, (min-width: 768px) 45vw, 90vw"
                className={cn(
                  "object-contain p-4 transition-transform duration-1000 md:p-8",
                  active ? "scale-100" : "scale-95",
                )}
              />
            </div>
          </div>
        );
      })}

      <div className="absolute right-4 bottom-4 flex items-center gap-1.5 sm:right-6 sm:bottom-6">
        <button type="button" onClick={() => setPaused((value) => !value)} aria-label={paused ? "Play slideshow" : "Pause slideshow"} className={control}>
          {paused ? <Play className="size-4" aria-hidden /> : <Pause className="size-4" aria-hidden />}
        </button>
        <button type="button" onClick={() => step(-1)} aria-label="Previous slide" className={control}>
          <ChevronLeft className="size-5" aria-hidden />
        </button>
        <button type="button" onClick={() => step(1)} aria-label="Next slide" className={control}>
          <ChevronRight className="size-5" aria-hidden />
        </button>
      </div>

      <div className="absolute bottom-7 left-6 flex gap-1.5 sm:bottom-9 sm:left-10 lg:left-12">
        {slides.map((slide, slideIndex) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => setIndex(slideIndex)}
            aria-label={`Go to slide ${slideIndex + 1}`}
            aria-current={slideIndex === index}
            className={cn(
              "h-1.5 rounded-full transition-all",
              slideIndex === index ? "w-8 bg-white" : "w-4 bg-white/35 hover:bg-white/60",
            )}
          />
        ))}
      </div>
    </section>
  );
}
