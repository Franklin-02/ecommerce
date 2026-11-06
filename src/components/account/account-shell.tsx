"use client";

import { Heart, LayoutDashboard, LogOut, MapPin, Package, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/cn";
import { initials } from "@/lib/format";
import { useHydrated } from "@/lib/store";
import { homeFor, signOut, useSession } from "@/stores/auth";

const nav = [
  { label: "Overview", href: "/account", icon: LayoutDashboard },
  { label: "Orders", href: "/account/orders", icon: Package },
  { label: "Wishlist", href: "/account/wishlist", icon: Heart },
  { label: "Addresses", href: "/account/addresses", icon: MapPin },
  { label: "Profile", href: "/account/profile", icon: User },
];

function AccountSkeleton() {
  return (
    <Container className="animate-pulse py-8" aria-busy="true" aria-label="Loading your account">
      <div className="grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)]">
        <div className="hidden h-72 rounded-card bg-surface-sunken lg:block" />
        <div>
          <div className="h-8 w-56 rounded-lg bg-surface-sunken" />
          <div className="mt-6 h-64 rounded-card bg-surface-sunken" />
        </div>
      </div>
    </Container>
  );
}

export function AccountShell({ children }: { children: ReactNode }) {
  const pathname = usePathname().replace(/(.)\/$/, "$1"); // the GitHub Pages build uses trailing slashes
  const router = useRouter();
  const hydrated = useHydrated();
  const session = useSession();
  const signingOut = useRef(false);

  useEffect(() => {
    if (!hydrated || signingOut.current) return;
    if (!session) {
      router.replace(`/login?next=${encodeURIComponent(pathname + window.location.search)}`);
    } else if (session.role !== "customer") {
      // Staff browsing the store have no customer account; send them home.
      router.replace(homeFor(session.role));
    }
  }, [hydrated, session, pathname, router]);

  if (!hydrated || !session || session.role !== "customer") return <AccountSkeleton />;

  const isActive = (href: string) => (href === "/account" ? pathname === href : pathname.startsWith(href));
  const onSignOut = () => {
    signingOut.current = true;
    signOut();
    router.push("/");
  };

  return (
    <Container className="py-6 lg:py-8">
      <div className="grid gap-6 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-8">
        <aside className="min-w-0">
          <div className="hidden items-center gap-3 px-3 pb-4 lg:flex">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-600 text-sm font-semibold text-white" aria-hidden>
              {initials(session.name)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink-950">{session.name}</p>
              <p className="truncate text-xs text-ink-500">{session.email}</p>
            </div>
          </div>
          <nav aria-label="Account">
            <ul className="scrollbar-none -mx-4 flex gap-1 overflow-x-auto px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
              {nav.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href} className="shrink-0">
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                        active ? "bg-brand-50 text-brand-700" : "text-ink-600 hover:bg-surface-muted hover:text-ink-950",
                      )}
                    >
                      <item.icon className="size-[1.1rem] shrink-0" aria-hidden />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
              <li className="shrink-0 lg:mt-2 lg:border-t lg:border-line lg:pt-2">
                <button
                  type="button"
                  onClick={onSignOut}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium whitespace-nowrap text-ink-600 transition-colors hover:bg-deal-soft hover:text-deal"
                >
                  <LogOut className="size-[1.1rem] shrink-0" aria-hidden />
                  Sign out
                </button>
              </li>
            </ul>
          </nav>
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </Container>
  );
}
