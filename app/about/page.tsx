"use client";

import { SiteLayout } from "@/app/layouts/SiteLayout";

export default function AboutPage() {
  return (
    <SiteLayout title="About Holy Grills">
      <main className="flex-1 md:pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-3xl space-y-6">
          <h1 className="font-display font-bold text-foreground text-2xl">About Holy Grills</h1>
          <p className="text-muted-foreground font-body">
            Holy Grills is a campus-first food platform built around Faith, Love, Energy, and Flavor.
          </p>
          <p className="text-muted-foreground font-body">
            We focus on affordable meals, fast fulfillment, and a loyalty experience with Holy Points (HP).
          </p>
        </div>
      </main>
    </SiteLayout>
  );
}
