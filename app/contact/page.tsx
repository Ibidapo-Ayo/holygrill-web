"use client";

import { SiteLayout } from "@/app/layouts/SiteLayout";

export default function ContactPage() {
  return (
    <SiteLayout title="Contact Us">
      <main className="flex-1 md:pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-3xl space-y-4">
          <h1 className="font-display font-bold text-foreground text-2xl">Contact Us</h1>
          <p className="text-muted-foreground font-body">Email: grillthevibe@gmail.com</p>
          <p className="text-muted-foreground font-body">Phone: 07053263931</p>
          <p className="text-muted-foreground font-body">Address: Yeolab Lodge, Asude, FUTA Westgate, Akure, Nigeria.</p>
        </div>
      </main>
    </SiteLayout>
  );
}
