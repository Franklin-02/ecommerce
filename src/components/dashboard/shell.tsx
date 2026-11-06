"use client";

import { Bell, ExternalLink, LogOut, Menu, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Logo } from "@/components/layout/logo";
import { Drawer } from "@/components/ui/drawer";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/cn";
import { formatDateTime, initials } from "@/lib/format";
import { employeesCollection } from "@/stores/admin-data";
import { signOut, useSession } from "@/stores/auth";
import type { Notification } from "@/types/commerce";

export interface ShellNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface ShellNavGroup {
  title?: string;
  items: ShellNavItem[];
}

interface DashboardShellProps {
  /** "Admin" or "Employee", shown beside the logo. */
  portal: string;
  homeHref: string;
  nav: ShellNavGroup[];
  user: { name: string; role: string };
  notifications: Notification[];
  children: ReactNode;
}

function NavList({ nav, homeHref, onNavigate }: { nav: ShellNavGroup[]; homeHref: string; onNavigate?: () => void }) {
  const pathname = usePathname().replace(/(.)\/$/, "$1"); // the GitHub Pages build uses trailing slashes
  const isActive = (href: string) => (href === homeHref ? pathname === href : pathname.startsWith(href));
  return (
    <nav aria-label="Sections" className="flex-1 space-y-5 overflow-y-auto p-3">
      {nav.map((group, index) => (
        <div key={group.title ?? index}>
          {group.title && <p className="eyebrow mb-1.5 px-3 text-ink-500">{group.title}</p>}
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                      active ? "bg-brand-50 text-brand-700" : "text-ink-600 hover:bg-surface-muted hover:text-ink-950",
                    )}
                  >
                    <item.icon className="size-[1.1rem] shrink-0" aria-hidden />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function NotificationsMenu({ notifications }: { notifications: Notification[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-label={`Notifications, ${notifications.length} new`}
        onClick={() => setOpen((value) => !value)}
        className="relative grid size-10 place-items-center rounded-full text-ink-800 hover:bg-surface-sunken"
      >
        <Bell className="size-5" aria-hidden />
        {notifications.length > 0 && <span className="absolute top-2 right-2.5 size-2 rounded-full bg-deal ring-2 ring-surface" aria-hidden />}
      </button>
      {open && (
        <div className="absolute top-full right-0 z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-line bg-surface p-2 shadow-overlay">
          <p className="px-3 py-2 text-sm font-semibold text-ink-950">Notifications</p>
          <ul>
            {notifications.map((item) => (
              <li key={item.id} className="rounded-xl px-3 py-2 hover:bg-surface-muted">
                <p className="text-sm font-medium text-ink-950">{item.title}</p>
                <p className="text-[0.8125rem] text-ink-600">{item.body}</p>
                <p className="mt-0.5 text-xs text-ink-500">{formatDateTime(item.at)}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/** Shared chrome for the admin and employee portals. */
export function DashboardShell({ portal, homeHref, nav, user, notifications, children }: DashboardShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const session = useSession();
  const employees = employeesCollection.useItems();
  // The signed-in person's live record; the session, then the prop, cover renders before it loads.
  const live = session?.employeeId ? employees.find((employee) => employee.id === session.employeeId) : undefined;
  const identity = live
    ? { name: live.name, role: live.role }
    : session?.employeeId
      ? { name: session.name, role: session.title ?? user.role }
      : user;
  const brand = (
    <div className="flex items-center gap-2">
      <Logo />
      <span className="eyebrow rounded-md bg-surface-sunken px-1.5 py-0.5 text-ink-600">{portal}</span>
    </div>
  );

  return (
    <div className="min-h-dvh bg-surface-muted">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-line bg-surface lg:flex">
        <div className="flex h-16 shrink-0 items-center border-b border-line px-5">{brand}</div>
        <NavList nav={nav} homeHref={homeHref} />
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-2 border-b border-line bg-surface/95 px-4 backdrop-blur sm:px-6">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
            className="-ml-2 grid size-10 place-items-center rounded-full text-ink-900 hover:bg-surface-sunken lg:hidden"
          >
            <Menu className="size-6" aria-hidden />
          </button>
          <div className="lg:hidden">{brand}</div>
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <Link href="/" className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-ink-600 hover:bg-surface-sunken sm:inline-flex">
              <ExternalLink className="size-4" aria-hidden />
              View store
            </Link>
            <NotificationsMenu notifications={notifications} />
            <div className="flex items-center gap-2.5 pl-1">
              <span className="grid size-9 place-items-center rounded-full bg-brand-600 text-xs font-semibold text-white" aria-hidden>
                {initials(identity.name)}
              </span>
              <div className="hidden leading-tight md:block">
                <p className="text-sm font-semibold text-ink-950">{identity.name}</p>
                <p className="text-xs text-ink-500">{identity.role}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={signOut}
              title="Sign out"
              className="grid size-10 place-items-center rounded-full text-ink-600 hover:bg-deal-soft hover:text-deal"
            >
              <LogOut className="size-5" aria-hidden />
              <span className="sr-only">Sign out</span>
            </button>
          </div>
        </header>
        <main id="main" className="mx-auto max-w-[96rem] p-4 sm:p-6">
          {children}
        </main>
      </div>

      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)} side="left" label="Menu" title={brand}>
        <NavList nav={nav} homeHref={homeHref} onNavigate={() => setMenuOpen(false)} />
      </Drawer>
      <Toaster />
    </div>
  );
}
