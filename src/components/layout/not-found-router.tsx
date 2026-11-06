"use client";

import type { ReactNode } from "react";
import { useHydrated } from "@/lib/store";

/**
 * A static host serves one 404.html for every unknown URL, so the shell is chosen
 * in the browser. Both gates show the same splash until hydration, so nothing flashes.
 */
export function NotFoundRouter({ store, admin }: { store: ReactNode; admin: ReactNode }) {
  const hydrated = useHydrated();
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const path = hydrated ? window.location.pathname.slice(basePath.length) : "";
  return /^\/admin(\/|$)/.test(path) ? admin : store;
}
