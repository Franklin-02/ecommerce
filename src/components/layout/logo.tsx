import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/cn";

export function Logo({ inverted = false, className }: { inverted?: boolean; className?: string }) {
  return (
    <Link href="/" aria-label={`${siteConfig.name} home`} className={cn("inline-flex items-center gap-2", className)}>
      <svg viewBox="0 0 32 32" className="size-8 shrink-0" aria-hidden>
        <rect width="32" height="32" rx="9" className="fill-brand-600" />
        <path
          d="M8 23h5.2v-2.3A7 7 0 0 1 9 14.4C9 10.3 12 7.5 16 7.5s7 2.8 7 6.9a7 7 0 0 1-4.2 6.3V23H24"
          fill="none"
          stroke="#fff"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className={cn("text-[1.375rem] font-bold tracking-tight", inverted ? "text-white" : "text-ink-950")}>
        {siteConfig.name.toLowerCase()}
      </span>
    </Link>
  );
}
