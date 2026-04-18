import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container grid gap-8 py-10 md:grid-cols-3">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
              HG
            </span>
            <span className="font-display text-lg text-foreground">Holygrill</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Warm grills, fast delivery, and a rewards system built for campus life.
          </p>
        </div>
        <div>
          <h3 className="mb-3 font-semibold text-foreground">Explore</h3>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link href="/menu" className="hover:text-foreground">
              Menu
            </Link>
            <Link href="/about" className="hover:text-foreground">
              About
            </Link>
            <Link href="/faq-contact-us" className="hover:text-foreground">
              FAQs & Support
            </Link>
          </div>
        </div>
        <div>
          <h3 className="mb-3 font-semibold text-foreground">Legal</h3>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link href="/privacy-policy" className="hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/terms-of-use" className="hover:text-foreground">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-border/80 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Holygrill. All rights reserved.
      </div>
    </footer>
  );
}
