"use client";

import { Clock, MapPin, PhoneCall } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PickUpWindow() {
  return (
    <section className="border-t border-border bg-background/70">
      <div className="container flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Pickup window</p>
          <h3 className="text-lg font-semibold text-foreground">Order ahead & pick up in under 15 minutes.</h3>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <Clock size={16} /> 10:00AM - 9:00PM
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin size={16} /> Akure campus hub
            </span>
            <span className="inline-flex items-center gap-2">
              <PhoneCall size={16} /> +234 800 123 4567
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="sm">
            <Link href="/faq-contact-us">Contact</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/menu">Place order</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
