'use client';

import { useMemo, useState } from 'react';
import { SiteLayout } from '@/app/layouts/SiteLayout';
import { EmptyState } from '@/components/shared/EmptyState';
import { EVENT_DISCOVERY_ITEMS } from '@/services/mocks/platform';
import { CalendarDays } from 'lucide-react';

export default function Page() {
  const [tab, setTab] = useState<'discover' | 'catering'>('discover');
  const events = useMemo(() => EVENT_DISCOVERY_ITEMS, []);

  return (
    <SiteLayout title="Events">
      <main className="flex-1 pb-12 pt-4 md:pt-24">
        <div className="container mx-auto max-w-5xl space-y-6 px-4">
          <section className="rounded-[2rem] border border-border bg-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Events</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Discover campus events or request catering.</h1>
            <div className="mt-4 inline-flex rounded-full border border-border bg-background p-1">
              {(['discover', 'catering'] as const).map((value) => (
                <button key={value} onClick={() => setTab(value)} className={`rounded-full px-4 py-2 text-sm font-semibold ${tab === value ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>{value === 'discover' ? 'Events discovery' : 'Catering request'}</button>
              ))}
            </div>
          </section>

          {tab === 'discover' ? (
            events.length ? (
              <div className="grid gap-4 md:grid-cols-2">
                {events.map((event) => (
                  <div key={event.id} className="rounded-[2rem] border border-border bg-card p-5">
                    <p className="text-sm font-semibold text-foreground">{event.title}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{event.description}</p>
                    <div className="mt-4 grid gap-2 text-xs text-muted-foreground sm:grid-cols-3">
                      <span>{event.date}</span>
                      <span>{event.location}</span>
                      <span>{event.capacity}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState icon={CalendarDays} title="No events yet" description="Fresh event drops will appear here once the backend feed is connected." />
            )
          ) : (
            <div className="rounded-[2rem] border border-border bg-card p-6 text-sm text-muted-foreground">
              Catering form validation structure is prepared for future backend submission: event type, guest count, date, pickup/delivery preference, and notes.
            </div>
          )}
        </div>
      </main>
    </SiteLayout>
  );
}
