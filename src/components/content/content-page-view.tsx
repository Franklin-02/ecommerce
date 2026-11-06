import { ArrowRight, ChevronDown, Clock, Info, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import type { ContentCard, ContentPage } from "@/types/content-pages";

function Card({ card }: { card: ContentCard }) {
  const inner = (
    <>
      <h2 className="text-base font-semibold tracking-tight text-ink-950">{card.title}</h2>
      <p className="mt-1 text-sm leading-6 text-ink-600">{card.body}</p>
      {card.href && (
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-600">
          Learn more <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </span>
      )}
    </>
  );
  const className = "group block h-full rounded-card border border-line bg-surface p-5";
  return card.href ? (
    <Link href={card.href} className={`${className} transition-shadow hover:border-line-strong hover:shadow-card`}>
      {inner}
    </Link>
  ) : (
    <div className={className}>{inner}</div>
  );
}

/** The one template behind every help, company and legal page. */
export function ContentPageView({ page }: { page: ContentPage }) {
  return (
    <>
      <div className="bg-surface-muted">
        <Container className="py-10 sm:py-14">
          <p className="eyebrow text-brand-600">{page.eyebrow}</p>
          <h1 className="mt-2 max-w-3xl text-3xl font-semibold tracking-tight text-balance text-ink-950 sm:text-4xl">{page.title}</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-ink-600">{page.intro}</p>
        </Container>
      </div>

      <Container className="py-10 sm:py-12">
        {page.note && (
          <p className="mb-8 flex max-w-3xl items-start gap-2.5 rounded-xl bg-warning-soft px-4 py-3 text-sm text-ink-800">
            <Info className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden />
            {page.note}
          </p>
        )}

        {page.cards && (
          <ul className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {page.cards.map((card) => (
              <li key={card.title}>
                <Card card={card} />
              </li>
            ))}
          </ul>
        )}

        {page.locations && (
          <ul className="grid gap-4 md:grid-cols-2">
            {page.locations.map((location) => (
              <li key={location.name} className="rounded-card border border-line p-5">
                <h2 className="text-lg font-semibold tracking-tight text-ink-950">{location.name}</h2>
                <ul className="mt-3 space-y-2 text-sm text-ink-600">
                  <li className="flex items-start gap-2.5">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-brand-600" aria-hidden />
                    {location.address}
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Clock className="mt-0.5 size-4 shrink-0 text-brand-600" aria-hidden />
                    {location.hours}
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Phone className="mt-0.5 size-4 shrink-0 text-brand-600" aria-hidden />
                    {location.phone}
                  </li>
                </ul>
                <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Services">
                  {location.services.map((service) => (
                    <li key={service} className="rounded-full bg-surface-muted px-2.5 py-1 text-xs font-medium text-ink-600">
                      {service}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}

        {page.sections.length > 0 && (
          <div className="max-w-3xl space-y-8">
            {page.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-xl font-semibold tracking-tight text-ink-950">{section.heading}</h2>
                {section.body?.map((paragraph) => (
                  <p key={paragraph} className="mt-2 text-[0.9375rem] leading-7 text-ink-600">
                    {paragraph}
                  </p>
                ))}
                {section.bullets && (
                  <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[0.9375rem] leading-7 text-ink-600 marker:text-brand-500">
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        )}

        {page.faqs && (
          <section aria-labelledby="faq-title" className="max-w-3xl">
            <h2 id="faq-title" className="mb-3 text-xl font-semibold tracking-tight text-ink-950">
              Frequently asked questions
            </h2>
            <div className="divide-y divide-line rounded-card border border-line">
              {page.faqs.map((faq) => (
                <details key={faq.question} className="group px-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[0.9375rem] font-medium text-ink-950 [&::-webkit-details-marker]:hidden">
                    {faq.question}
                    <ChevronDown className="size-4 shrink-0 text-ink-500 transition-transform group-open:rotate-180" aria-hidden />
                  </summary>
                  <p className="pb-4 text-sm leading-6 text-ink-600">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {page.related && (
          <nav aria-label="Related pages" className="mt-10 flex max-w-3xl flex-wrap gap-2 border-t border-line pt-6">
            {page.related.map((link) => (
              <Link key={link.href} href={link.href} className="rounded-full bg-surface-muted px-3.5 py-1.5 text-sm font-medium text-ink-800 hover:bg-brand-50 hover:text-brand-700">
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </Container>
    </>
  );
}
