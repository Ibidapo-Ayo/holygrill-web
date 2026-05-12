import { HPProgressBar } from '@/components/hp/HPProgressBar';
import { Trophy, Gift, Flame, Star, Lock } from 'lucide-react';
import { Link } from '@/lib/router';
import { useAuthStore } from '@/stores/authStore';

const TIERS = [
  { name: 'Rookie', min: 0, perk: '5% off first order', color: 'bg-secondary' },
  { name: 'Hungry', min: 100, perk: 'Free delivery on orders > ₦8k', color: 'bg-accent/30' },
  { name: 'Holy Eater', min: 300, perk: '10% cashback in HP', color: 'bg-primary/20' },
  { name: 'Grill Master', min: 750, perk: 'Priority kitchen + free sides', color: 'bg-gradient-cta text-primary-foreground' },
];

const REWARDS = [
  { hp: 50, title: 'Free Soft Drink', desc: 'Any 50cl bottle on your next order' },
  { hp: 120, title: '₦1,500 Off', desc: 'Discount on any meal above ₦5,000' },
  { hp: 250, title: 'Free Side', desc: 'Plantain, fries, or coleslaw — your pick' },
  { hp: 500, title: 'Free Holy Combo', desc: 'On the house. Welcome to royalty.' },
];

const RewardsPage = () => {
  const { isAuthenticated, user } = useAuthStore();
  const currentHP = 185; // mock HP value for authenticated users

  if (!isAuthenticated) {
    return (
      <main className="flex-1 pt-4 md:pt-24 pb-12 flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-md text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Lock size={36} className="text-primary" />
          </div>
          <div className="space-y-2">
            <h1 className="font-display font-bold text-foreground text-2xl">Members Only</h1>
            <p className="text-muted-foreground font-body text-sm">
              Sign in to view your Holy Points, unlock tier rewards, and redeem free meals.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-cta text-primary-foreground font-extrabold shadow-glow"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-primary text-primary font-extrabold hover:bg-primary/5 transition-colors"
            >
              Create Account
            </Link>
          </div>
          <p className="text-xs text-muted-foreground font-body">
            Earn 1 HP for every ₦100 spent. Redeem for free meals.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 pt-4 md:pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-3xl space-y-10">
        <div className="rounded-3xl bg-gradient-dark text-brand-brown-foreground p-6 md:p-8 shadow-card relative overflow-hidden">
          <div className="absolute -right-6 -top-6 opacity-20">
            <Gift className="w-40 h-40" />
          </div>
          <p className="text-xs font-bold uppercase tracking-widest opacity-80">Your Holy Points</p>
          <div className="flex items-end gap-2 mt-2">
            <span className="text-5xl md:text-6xl font-black text-gradient-fire">{currentHP}</span>
            <span className="text-lg font-bold opacity-80 mb-1.5">HP</span>
          </div>
          <p className="text-sm opacity-80 mt-2">Earn 1 HP for every ₦100 spent. Redeem for free meals.</p>
          <div className="mt-5">
            <HPProgressBar currentHP={currentHP} label="Next tier: Holy Eater (300 HP)" />
          </div>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-extrabold text-foreground flex items-center gap-2">
            <Trophy className="text-primary" size={20} /> Tiers
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {TIERS.map((t) => {
              const unlocked = currentHP >= t.min;
              return (
                <div
                  key={t.name}
                  className={`rounded-2xl p-4 border border-border ${t.color} ${unlocked ? '' : 'opacity-60'}`}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-extrabold">{t.name}</p>
                    <span className="text-xs font-bold bg-card/80 px-2 py-0.5 rounded-full text-foreground">{t.min} HP</span>
                  </div>
                  <p className="text-xs mt-1 opacity-90">{t.perk}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-extrabold text-foreground flex items-center gap-2">
            <Gift className="text-primary" size={20} /> Redeem
          </h2>
          <div className="space-y-3">
            {REWARDS.map((r) => {
              const canRedeem = currentHP >= r.hp;
              return (
                <div
                  key={r.title}
                  className="bg-card rounded-2xl p-4 shadow-card border border-border flex items-center gap-4"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-card flex items-center justify-center shrink-0">
                    <Flame className="text-brand-brown" size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-extrabold text-foreground truncate">{r.title}</p>
                    <p className="text-xs text-muted-foreground">{r.desc}</p>
                  </div>
                  <button
                    disabled={!canRedeem}
                    className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap ${
                      canRedeem
                        ? 'bg-gradient-cta text-primary-foreground shadow-glow'
                        : 'bg-muted text-muted-foreground cursor-not-allowed'
                    }`}
                  >
                    {canRedeem ? 'Redeem' : `${r.hp} HP`}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        <div className="text-center">
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-cta text-primary-foreground font-extrabold shadow-glow"
          >
            <Star size={18} /> Earn more HP
          </Link>
        </div>
      </div>
    </main>
  );
};

export default RewardsPage;
