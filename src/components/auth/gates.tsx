"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { Logo } from "@/components/layout/logo";
import { useHydrated } from "@/lib/store";
import { employeesCollection } from "@/stores/admin-data";
import { homeFor, signOut, useSession, type Role } from "@/stores/auth";

/** Shown while the session is checked or a redirect is on its way. */
function GateSplash() {
  return (
    <div role="status" aria-label="Checking your session" className="grid min-h-dvh place-items-center bg-surface-muted">
      <div className="animate-pulse">
        <Logo />
      </div>
    </div>
  );
}

/** Runs client-side only (inside effects), so the query string can ride along in next. */
const loginPath = (pathname: string) => `/login?next=${encodeURIComponent(pathname + window.location.search)}`;

/** The storefront requires a signed-in session of any role. */
export function StoreGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const hydrated = useHydrated();
  const session = useSession();

  useEffect(() => {
    if (hydrated && !session) router.replace(loginPath(pathname));
  }, [hydrated, session, pathname, router]);

  if (!hydrated || !session) return <GateSplash />;
  return <>{children}</>;
}

/** The admin and employee portals each require their own role. */
export function PortalGate({ area, children }: { area: Extract<Role, "admin" | "employee">; children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const hydrated = useHydrated();
  const session = useSession();
  const employees = employeesCollection.useItems();
  // A staff session whose record the admin has since removed gets signed out.
  const removed = Boolean(session?.employeeId) && !employees.some((employee) => employee.id === session?.employeeId);

  useEffect(() => {
    if (!hydrated) return;
    if (!session) {
      router.replace(loginPath(pathname));
    } else if (removed) {
      signOut(); // the !session branch then redirects to the login page
    } else if (session.role !== area) {
      router.replace(homeFor(session.role));
    }
  }, [hydrated, session, removed, area, pathname, router]);

  if (!hydrated || !session || removed || session.role !== area) return <GateSplash />;
  return <>{children}</>;
}
