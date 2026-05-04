"use client";

import { SiteLayout } from "@/app/layouts/SiteLayout";

export default function SupportPage() {
  return (
    <SiteLayout title="Support">
      <main className="flex-1 md:pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-3xl space-y-4">
          <h1 className="font-display font-bold text-foreground text-2xl">Support</h1>
          <p className="text-muted-foreground font-body">Need help with an order? Reach us via contact channels and we’ll respond quickly.</p>
        </div>
      </main>
    </SiteLayout>
  );
}
