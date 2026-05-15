'use client';

import { useState } from 'react';
import { SiteLayout } from '@/app/layouts/SiteLayout';
import { EmptyState } from '@/components/shared/EmptyState';
import { EVENT_DISCOVERY_ITEMS, MARKETPLACE_VENDORS } from '@/services/mocks/platform';
import { Store } from 'lucide-react';

export default function Page() {
  const [category, setCategory] = useState('All');
  const categories = ['All', ...new Set(MARKETPLACE_VENDORS.map((vendor) => vendor.category))];
  const visible = MARKETPLACE_VENDORS.filter((vendor) => category === 'All' || vendor.category === category);

  return (
    <SiteLayout title="Marketplace">
      <main className="flex-1 pb-12 pt-4 md:pt-24">
        <div className="container mx-auto max-w-5xl space-y-6 px-4">
          <section className="rounded-[2rem] border border-border bg-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Marketplace</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Browse locked and live HP drops.</h1>
            <div className="mt-4 flex flex-wrap gap-2">
              {categories.map((value) => (
                <button key={value} onClick={() => setCategory(value)} className={`rounded-full px-4 py-2 text-sm font-semibold ${category === value ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground'}`}>{value}</button>
              ))}
            </div>
          </section>
          {visible.length ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {visible.map((vendor) => (
                <div key={vendor.id} className="rounded-[2rem] border border-border bg-card p-5">
                  <p className="text-sm font-semibold text-foreground">{vendor.name}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{vendor.description}</p>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="font-semibold text-primary">{vendor.hpPrice} HP</span>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${vendor.locked ? 'bg-secondary text-muted-foreground' : 'bg-primary/10 text-primary'}`}>{vendor.locked ? 'Locked' : 'Available'}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={Store} title="Marketplace not launched" description="Category filters and vendor cards are ready, but no drops are live yet." />
          )}

          <section className="rounded-[2rem] border border-border bg-card p-6">
            <h2 className="font-display text-2xl font-bold text-foreground">Campus events</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {EVENT_DISCOVERY_ITEMS.map((event) => (
                <div key={event.id} className="rounded-2xl border border-border bg-background/70 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-foreground">{event.title}</p>
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">+25 HP</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{event.description}</p>
                  <p className="mt-3 text-xs text-muted-foreground">{event.date}</p>
                  <button className="mt-4 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">
                    {event.title.toLowerCase().includes('run') ? 'Get Ticket' : 'RSVP'}
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </SiteLayout>
  );
}
