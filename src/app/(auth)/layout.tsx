import { ClipboardList, LayoutDashboard, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/layout/logo";
import { siteConfig } from "@/config/site";

const roles = [
  { icon: ShoppingBag, text: "Customers browse the store, buy and track orders" },
  { icon: ClipboardList, text: "Employees pick, pack and ship assigned orders" },
  { icon: LayoutDashboard, text: "The admin runs products, orders, people and reports" },
];

/** The site's front door: sign-in screens live outside the store chrome. */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-surface-muted">
      <header className="flex h-16 items-center justify-center border-b border-line bg-surface">
        <Logo />
      </header>
      <main>
        <Container className="py-6 lg:py-10">
          <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
          <div className="mx-auto w-full max-w-md self-center rounded-panel bg-surface p-6 shadow-card sm:p-10">{children}</div>
          <aside className="relative hidden min-h-[36rem] overflow-hidden rounded-panel bg-gradient-to-br from-ink-950 via-ink-900 to-[#1b2a6b] p-10 text-white lg:block">
            <p className="eyebrow text-brand-300">{siteConfig.name} demo</p>
            <p className="mt-3 max-w-sm text-3xl leading-tight font-semibold tracking-tight">One store. Three sign-ins.</p>
            <ul className="mt-6 space-y-3">
              {roles.map((role) => (
                <li key={role.text} className="flex items-center gap-3 text-sm text-white/80">
                  <role.icon className="size-5 shrink-0 text-brand-300" aria-hidden />
                  {role.text}
                </li>
              ))}
            </ul>
            <p className="mt-4 max-w-sm text-sm text-white/60">Employee accounts are created by the admin, under Employees.</p>
            <Image
              src="/images/products/aurex-quiet-one-anc-headphones.svg"
              alt=""
              width={340}
              height={340}
              className="absolute -right-8 -bottom-10 size-80 object-contain"
            />
          </aside>
          </div>
        </Container>
      </main>
    </div>
  );
}
