"use client";

import { SiteLayout } from "@/app/layouts/SiteLayout";

export default function TermsPage() {
  return (
    <SiteLayout title="Terms of Service">
      <main className="flex-1 md:pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-3xl space-y-4">
          <h1 className="font-display font-bold text-foreground text-2xl">Terms of Service</h1>
          <p className="text-muted-foreground font-body">By using Holy Grills, you agree to our ordering, payment, and usage terms.</p>
          <p className="text-muted-foreground font-body">For inquiries, contact grillthevibe@gmail.com.</p>
        </div>
      </main>
    </SiteLayout>
  );
}
