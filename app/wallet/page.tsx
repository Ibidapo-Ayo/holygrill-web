'use client';

import { SiteLayout } from '@/app/layouts/SiteLayout';
import { WALLET_TRANSACTIONS } from '@/services/mocks/platform';
import { formatPrice } from '@/data/menu';

export default function Page() {
  return (
    <SiteLayout title="Wallet">
      <main className="flex-1 pb-12 pt-4 md:pt-24">
        <div className="container mx-auto max-w-4xl space-y-6 px-4">
          <section className="rounded-[2rem] border border-border bg-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Wallet</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Top up once, pay quickly all week.</h1>
            <p className="mt-2 text-sm text-muted-foreground">Minimum top-up is ₦1,000. Backend-ready payment and ledger hooks are reserved in the service layer.</p>
            <div className="mt-5 rounded-[2rem] bg-primary/10 p-5">
              <p className="text-sm font-semibold text-foreground">Available balance</p>
              <p className="mt-2 font-display text-4xl font-bold text-primary">₦8,400</p>
            </div>
          </section>
          <section className="rounded-[2rem] border border-border bg-card p-6">
            <h2 className="font-display text-xl font-bold text-foreground">Top-up flow UI</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[1000, 2500, 5000].map((amount) => <button key={amount} className="rounded-2xl border border-border px-4 py-4 text-left text-sm font-semibold text-foreground">Top up {formatPrice(amount)}</button>)}
            </div>
          </section>
          <section className="rounded-[2rem] border border-border bg-card p-6">
            <h2 className="font-display text-xl font-bold text-foreground">Transaction history</h2>
            <div className="mt-4 space-y-3">
              {WALLET_TRANSACTIONS.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between rounded-2xl bg-secondary/50 px-4 py-3 text-sm">
                  <div>
                    <p className="font-semibold text-foreground">{transaction.label}</p>
                    <p className="text-xs text-muted-foreground">{transaction.date}</p>
                  </div>
                  <span className={transaction.type === 'credit' ? 'text-success' : 'text-foreground'}>{transaction.type === 'credit' ? '+' : ''}{formatPrice(transaction.amount)}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </SiteLayout>
  );
}
