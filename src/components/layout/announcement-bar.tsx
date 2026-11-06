import Link from "next/link";
import { Container } from "@/components/ui/container";
import { announcements, utilityLinks } from "@/config/site";

export function AnnouncementBar() {
  return (
    <div className="bg-ink-950 text-white/85">
      <Container className="flex h-9 items-center justify-center text-xs lg:justify-between">
        <ul className="flex items-center gap-6">
          {announcements.map((message, index) => (
            <li key={message.text} lang={message.lang} className={index === 0 ? "" : "hidden lg:block"}>
              {message.text}
            </li>
          ))}
        </ul>
        <nav aria-label="Utility" className="hidden items-center gap-5 lg:flex">
          {utilityLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>
      </Container>
    </div>
  );
}
