import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background text-center text-foreground">
      <div className="rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold text-primary">Page not found</div>
      <h1 className="font-display text-3xl font-bold">Oops, we couldn&apos;t find that page.</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        The link you followed might be broken or the page may have moved. Let&apos;s get you back to something tasty.
      </p>
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/">Go home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/menu">View menu</Link>
        </Button>
      </div>
    </div>
  );
}
