import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface SectionHeaderProps {
  id?: string;
  eyebrow?: string;
  title: string;
  href?: string;
  linkLabel?: string;
}

export function SectionHeader({ id, eyebrow, title, href, linkLabel = "View all" }: SectionHeaderProps) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="eyebrow mb-1.5 text-brand-600">{eyebrow}</p>}
        <h2 id={id} className="text-2xl font-semibold tracking-tight text-ink-950 sm:text-3xl">
          {title}
        </h2>
      </div>
      {href && (
        <Link
          href={href}
          aria-label={`${linkLabel}: ${title}`}
          className="group inline-flex shrink-0 items-center gap-1.5 pb-1 text-sm font-semibold text-ink-800 hover:text-brand-600"
        >
          {linkLabel}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </Link>
      )}
    </div>
  );
}
