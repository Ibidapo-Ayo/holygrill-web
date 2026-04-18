import Link from "next/link";

const adminLinks = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/menu", label: "Menu" },
  { href: "/admin/banner", label: "Banner" },
];

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/70">
        <div className="container flex items-center justify-between py-4">
          <Link href="/" className="font-display text-lg font-bold">
            Holygrill Admin
          </Link>
          <nav className="flex items-center gap-4 text-sm text-muted-foreground">
            {adminLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-foreground">
                {link.label}
              </Link>
            ))}
          </nav>
          <Link href="/" className="text-sm font-semibold text-primary hover:underline">
            Back to site
          </Link>
        </div>
      </header>
      <main className="container py-8">{children}</main>
    </div>
  );
}
