"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutPanelTop, Menu, Phone } from "lucide-react";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/menu", label: "Menu", icon: Menu },
  { href: "/about", label: "About", icon: LayoutPanelTop },
  { href: "/faq-contact-us", label: "Help", icon: Phone },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 pb-safe backdrop-blur md:hidden">
      <div className="grid grid-cols-4">
        {items.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 px-4 py-3 text-xs font-medium"
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-full border ${
                  active
                    ? "border-primary/40 bg-primary/10 text-primary shadow-glow"
                    : "border-border bg-card text-muted-foreground"
                }`}
              >
                <Icon size={18} />
              </span>
              <span className={active ? "text-foreground" : "text-muted-foreground"}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
