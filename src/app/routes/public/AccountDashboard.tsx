import { useState } from 'react';
import { Bell, Gift, LogOut, Settings, Wallet } from 'lucide-react';
import { Link, useNavigate } from '@/lib/router';
import { HPBadge } from '@/components/hp/HPBadge';
import { HPProgressBar } from '@/components/hp/HPProgressBar';
import { OrderCard } from '@/components/orders/OrderCard';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { MOCK_ORDERS } from '@/data/mockOrders';
import { DASHBOARD_STATS, HP_TRANSACTIONS, REWARD_CHALLENGES } from '@/services/mocks/platform';
import { EmptyState } from '@/components/shared/EmptyState';
import { useAuthStore, getInitials, safeImageUrl } from '@/stores/authStore';

const AccountDashboardPage = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [engagementTab, setEngagementTab] = useState<'challenges' | 'referrals'>('challenges');

  if (!isAuthenticated || !user) {
    return (
      <main className="flex-1 pb-12 md:pt-24">
        <div className="container mx-auto max-w-3xl px-4">
          <EmptyState
            icon={Gift}
            title="Sign in to access your dashboard"
            description="Track HP, wallet balance, recent orders, and referral activity once you're signed in."
            ctaLabel="Go to login"
            ctaTo="/login"
          />
        </div>
      </main>
    );
  }

  const userOrders = MOCK_ORDERS.filter((order) => order.userId === user.id);
  const initials = getInitials(user.name);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <main className="flex-1 pb-12 md:pt-24">
      <div className="container mx-auto space-y-6 px-4">
        <section className="rounded-[2rem] border border-border bg-card p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-fire">
                {safeImageUrl(user.avatarUrl) ? (
                  <img src={safeImageUrl(user.avatarUrl)!} alt={user.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-xl font-bold text-primary-foreground">{initials}</span>
                )}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Dashboard hub</p>
                <h1 className="mt-1 font-display text-3xl font-bold text-foreground">Welcome back, {user.name.split(' ')[0]}</h1>
                <p className="mt-2 text-sm text-muted-foreground">Leaderboard, referrals, challenges, wallet, and tier progress live together here.</p>
              </div>
            </div>
            <button className="inline-flex items-center gap-2 self-start rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-secondary" aria-label="Open notifications">
              <Bell size={16} /> Notifications
            </button>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[1.3fr,1fr]">
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
              <div className="mt-5 flex flex-wrap gap-2">
                <Link to="/rewards" className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">View rewards preview <Gift size={14} /></Link>
                <Link to="/leaderboard" className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground">Leaderboard</Link>
                <Link to="/marketplace" className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground">Marketplace</Link>
              </div>
            </div>
            <div className="rounded-[2rem] border border-border bg-background/70 p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground"><Wallet size={16} className="text-primary" /> Wallet</div>
              <p className="mt-4 font-display text-3xl font-bold text-foreground">₦8,400</p>
              <p className="mt-2 text-sm text-muted-foreground">Fund before peak lunch so checkout stays instant.</p>
              <div className="mt-5 flex gap-2">
                <Link to="/wallet" className="inline-flex rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground">Open wallet</Link>
                <button className="inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Fund wallet</button>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-3 grid-cols-2 md:grid-cols-4">
          {DASHBOARD_STATS.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-border bg-card p-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</p>
              <p className="mt-2 font-display text-xl font-bold text-foreground">{stat.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{stat.helper}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
          <div className="space-y-4 rounded-[2rem] border border-border bg-card p-6">
            <SectionHeader title="HP ledger" description="Full transaction history" />
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
            <div className="inline-flex rounded-full border border-border bg-background p-1">
              <button onClick={() => setEngagementTab('challenges')} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${engagementTab === 'challenges' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>Active Challenges</button>
              <button onClick={() => setEngagementTab('referrals')} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${engagementTab === 'referrals' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>Referrals</button>
            </div>
            {engagementTab === 'challenges' ? (
              <>
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
              </>
            ) : (
              <div className="rounded-2xl bg-primary/10 p-4">
                <p className="text-sm font-semibold text-foreground">3 successful invites</p>
                <p className="mt-1 text-sm text-muted-foreground">Wallet bonuses and HP boosts are waiting on the referrals page.</p>
                <Link to="/referrals" className="mt-3 inline-flex rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">Open referrals</Link>
              </div>
            )}

            <div id="profile" className="rounded-2xl border border-dashed border-border p-4 text-sm text-muted-foreground">Profile settings and notification preferences are reserved here for backend auth integration.</div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Link to="/profile" className="flex items-center justify-center gap-2 rounded-lg bg-secondary py-3 text-sm font-medium text-foreground transition-colors hover:bg-border"><Settings size={16} /> Edit Profile</Link>
              <button onClick={handleLogout} className="flex items-center justify-center gap-2 rounded-lg bg-destructive/10 py-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive/20"><LogOut size={16} /> Logout</button>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <SectionHeader title="Recent orders" action={<Link to="/orders" className="text-sm font-semibold text-primary">See all orders</Link>} />
          {userOrders.length ? userOrders.map((order) => <OrderCard key={order.id} order={order} />) : (
            <EmptyState icon={Gift} title="No orders yet" description="Start an order to see your HP progress and delivery history here." ctaLabel="Browse menu" ctaTo="/menu" />
          )}
        </section>
      </div>
    </main>
  );
};

export default AccountDashboardPage;
