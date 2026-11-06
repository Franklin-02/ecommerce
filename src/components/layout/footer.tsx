import { Mail, Phone } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { footerColumns, legalLinks, paymentMethods, siteConfig } from "@/config/site";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="bg-ink-950 text-white/70">
      <Container className="grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <Logo inverted />
          <p className="mt-4 max-w-xs text-sm leading-6">{siteConfig.description}</p>
          <ul className="mt-5 space-y-2 text-sm">
            <li>
              <a href={`tel:${siteConfig.supportPhone}`} className="inline-flex items-center gap-2 hover:text-white">
                <Phone className="size-4" aria-hidden /> {siteConfig.supportPhone}
              </a>
            </li>
            <li>
              <a href={`mailto:${siteConfig.supportEmail}`} className="inline-flex items-center gap-2 hover:text-white">
                <Mail className="size-4" aria-hidden /> {siteConfig.supportEmail}
              </a>
            </li>
          </ul>
        </div>
        {footerColumns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h2 className="text-sm font-semibold text-white">{column.title}</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {column.links.map((link) => (
                <li key={link.href + link.label}>
                  <Link href={link.href} className="hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-4 py-6 lg:flex-row lg:items-center lg:justify-between">
          <ul className="flex flex-wrap gap-2" aria-label="Accepted payment methods">
            {paymentMethods.map((method) => (
              <li key={method} className="rounded-md border border-white/15 px-2 py-1 font-mono text-[0.6875rem] text-white/70">
                {method}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
            <span>© 2026 {siteConfig.name} Electronics, Chennai</span>
            <span>GSTIN {siteConfig.gstin}</span>
            <Link href="/admin" className="hover:text-white">
              Admin portal
            </Link>
            <Link href="/employee" className="hover:text-white">
              Employee portal
            </Link>
            {legalLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
        </Container>
      </div>
    </footer>
  );
}
