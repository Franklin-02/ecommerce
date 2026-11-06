"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Next.js skips scrolling when the new page's top is already on screen, which
 * leaves it hidden under the sticky header. This always starts a new page at the
 * top, while back and forward keep the position the browser restores.
 */
export function ScrollReset() {
  const pathname = usePathname();
  const previous = useRef(pathname);
  const fromHistory = useRef(false);

  useEffect(() => {
    const markHistoryNavigation = () => {
      fromHistory.current = true;
    };
    window.addEventListener("popstate", markHistoryNavigation);
    return () => window.removeEventListener("popstate", markHistoryNavigation);
  }, []);

  useEffect(() => {
    if (previous.current === pathname) return;
    previous.current = pathname;
    if (!fromHistory.current) window.scrollTo({ top: 0, behavior: "instant" });
    fromHistory.current = false;
  }, [pathname]);

  return null;
}
