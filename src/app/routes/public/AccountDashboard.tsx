import { Bell, Flame, Gift, Wallet } from 'lucide-react';
import { Link } from '@/lib/router';
import { HPBadge } from '@/components/hp/HPBadge';
import { HPProgressBar } from '@/components/hp/HPProgressBar';
import { OrderCard } from '@/components/orders/OrderCard';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { DASHBOARD_SIDEBAR_LINKS } from '@/constants/navigation';
import { MOCK_ORDERS } from '@/data/mockOrders';
import { formatPrice } from '@/data/menu';
import { DASHBOARD_STATS, HP_TRANSACTIONS, REWARD_CHALLENGES } from '@/services/mocks/platform';

const userOrders = MOCK_ORDERS.filter((order) => order.userId === 'usr-001');

const AccountDashboardPage = () => {
  return (
    <main className="flex-1 pb-12 md:pt-24">
      <div className="container mx-auto grid gap-8 px-4 lg:grid-cols-[220px,1fr]">
        <aside className="hidden h-fit rounded-[2rem] border border-border bg-card p-4 lg:block">
          <p className="px-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary">Dashboard</p>
          <nav className="mt-4 space-y-1">
            {DASHBOARD_SIDEBAR_LINKS.map((link) => (
              <Link key={link.to} to={link.to} className="block rounded-2xl px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>

        <div className="space-y-8">
          <section className="rounded-[2rem] border border-border bg-card p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">HP ecosystem hub</p>
                <h1 className="mt-1 font-display text-3xl font-bold text-foreground">Welcome back, Adewale</h1>
                <p className="mt-2 text-sm text-muted-foreground">Track your level, wallet, orders, referrals, and challenge progress from one dashboard.</p>
              </div>
              <button className="inline-flex items-center gap-2 self-start rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-secondary" aria-label="Open notifications">
                <Bell size={16} /> Notifications
              </button>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr,0.8fr]">
              <div className="rounded-[2rem] bg-secondary/60 p-5">
                <div className="flex items-center gap-3">
                  <HPBadge value={248} size="md" variant="available" />
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Holy Eater tier</span>
                </div>
                <h2 className="mt-4 font-display text-2xl font-bold text-foreground">248 HP balance</h2>
                <p className="mt-2 text-sm text-muted-foreground">52 HP to reach Grill Master perks.</p>
                <div className="mt-4">
                  <HPProgressBar currentHP={248} label="Tier progress" />
                </div>
                <Link to="/rewards" className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
                  View rewards preview <Gift size={14} />
                </Link>
              </div>
              <div className="rounded-[2rem] border border-border bg-background/70 p-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground"><Wallet size={16} className="text-primary" /> Wallet card</div>
                <p className="mt-4 font-display text-3xl font-bold text-foreground">₦8,400</p>
                <p className="mt-2 text-sm text-muted-foreground">Top up before peak lunch so checkout stays instant.</p>
                <Link to="/wallet" className="mt-5 inline-flex rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground">Open wallet</Link>
              </div>
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {DASHBOARD_STATS.map((stat) => (
              <div key={stat.label} className="rounded-[2rem] border border-border bg-card p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</p>
                <p className="mt-3 font-display text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="mt-2 text-sm text-muted-foreground">{stat.helper}</p>
              </div>
            ))}
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
            <div className="space-y-4 rounded-[2rem] border border-border bg-card p-6">
              <SectionHeader title="HP transaction log" description="Mock loyalty activity ready for backend sync." />
              <div className="space-y-3">
                {HP_TRANSACTIONS.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between rounded-2xl bg-secondary/50 px-4 py-3 text-sm">
                    <div>
                      <p className="font-semibold text-foreground">{transaction.label}</p>
                      <p className="text-xs text-muted-foreground">{transaction.date}</p>
                    </div>
                    <span className={transaction.hp > 0 ? 'text-success' : 'text-primary'}>{transaction.hp > 0 ? '+' : ''}{transaction.hp} HP</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 rounded-[2rem] border border-border bg-card p-6">
              <SectionHeader title="Active challenges" description="Modular loyalty tasks without duplicated tier UI." />
              {REWARD_CHALLENGES.map((challenge) => (
                <div key={challenge.id} className="rounded-2xl bg-secondary/50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-foreground">{challenge.title}</p>
                    <span className="text-xs font-semibold text-primary">+{challenge.rewardHP} HP</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{challenge.description}</p>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-background">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${(challenge.current / challenge.target) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
            <div className="space-y-4">
              <SectionHeader title="Recent orders" action={<Link to="/orders" className="text-sm font-semibold text-primary">See all orders</Link>} />
              {userOrders.map((order) => <OrderCard key={order.id} order={order} />)}
            </div>
            <div className="space-y-4 rounded-[2rem] border border-border bg-card p-6">
              <SectionHeader title="Referrals" description="Reusable student growth module." />
              <div className="rounded-2xl bg-primary/10 p-4">
                <p className="text-sm font-semibold text-foreground">3 successful invites</p>
                <p className="mt-1 text-sm text-muted-foreground">Wallet bonuses and HP boosts are waiting on the referrals page.</p>
              </div>
              <Link to="/referrals" className="inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Open referrals</Link>
              <div id="profile" className="rounded-2xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                Profile settings and notification preferences are reserved here for backend auth integration.
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default AccountDashboardPage;
