import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/cn";

export function Logo({ inverted = false, className }: { inverted?: boolean; className?: string }) {
  return (
    <Link href="/" aria-label={`${siteConfig.name} home`} className={cn("inline-flex items-center", className)}>
      <Image
        src="/images/brand/kanishka-logo.png"
        alt=""
        width={543}
        height={181}
        priority
        // The artwork is navy on transparent, so dark surfaces get a white chip behind it.
        className={cn("h-10 w-auto", inverted && "rounded-xl bg-white px-2.5 py-1.5")}
      />
    </Link>
  );
}
