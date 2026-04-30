"use client";

import { SiteLayout } from "@/app/layouts/SiteLayout";

export default function TrustPage() {
  return (
    <SiteLayout title="Your Trust">
      <main className="flex-1 md:pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-3xl space-y-4">
          <h1 className="font-display font-bold text-foreground text-2xl">Your Trust & Privacy</h1>
          <p className="text-muted-foreground font-body">We handle personal and order data responsibly and only for service delivery.</p>
          <p className="text-muted-foreground font-body">We continuously improve security and data handling practices.</p>
        </div>
      </main>
    </SiteLayout>
  );
}
