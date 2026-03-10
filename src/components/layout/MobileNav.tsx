"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const mobileLinks = [
  { href: "/", label: "Home", icon: "⌂" },
  { href: "/projects", label: "Projects", icon: "◈" },
  { href: "/about", label: "About", icon: "◉" },
  { href: "/blog", label: "Blog", icon: "✎" },
  { href: "/contact", label: "Contact", icon: "✉" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-lavender/30 bg-surface/90 backdrop-blur-md md:hidden"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around py-2">
        {mobileLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 text-xs ${
                isActive ? "text-accent" : "text-text-muted"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="text-lg" aria-hidden>
                {link.icon}
              </span>
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
