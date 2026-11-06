"use client";

import { useSearchParams } from "next/navigation";

/**
 * Detail pages take their record from ?id= rather than a path segment. A static
 * export can only prerender known paths, and orders and customers created in the
 * browser don't exist at build time.
 */
export function useQueryId() {
  return useSearchParams().get("id") ?? "";
}
