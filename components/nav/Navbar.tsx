import Link from "next/link";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "About" },
  { href: "/faq-contact-us", label: "Support" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="container flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-foreground">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow">
            HG
          </span>
          <span className="font-display tracking-tight">Holygrill</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-foreground transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/menu"
          className="hidden rounded-full bg-gradient-cta px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-90 md:inline-flex"
        >
          Order now
        </Link>
      </div>
    </header>
  );
}
