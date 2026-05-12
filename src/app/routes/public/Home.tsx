'use client';

import { ArrowRight, CalendarDays, Flame, ShoppingBag, Store, Trophy } from 'lucide-react';
import { Link } from '@/lib/router';
import { HeroCarousel } from '@/components/hero/HeroCarousel';
import { FoodCard } from '@/components/menu/FoodCard';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { StatusStrip } from '@/components/shared/StatusStrip';
import { StoreClosedDialog } from '@/components/shared/StoreClosedDialog';
import { useCartStore } from '@/stores/cartStore';
import { MOCK_MENU } from '@/data/menu';
import { LEADERBOARD_ENTRIES } from '@/services/mocks/platform';
import { getCartQuantityForMenuItem, getPrimaryCartLineId } from '@/utils/pricing';
import type { HeroSlide } from '@/types';
import { toast } from 'sonner';

const FEATURED = MOCK_MENU.filter((item) => item.isAvailable).slice(0, 4);

const EXPERIENCES = [
  {
    title: 'Events & catering',
    description: 'Host faculty hangs, birthday drops, and late-night study feasts with flexible catering requests.',
    cta: '/events',
    icon: CalendarDays,
  },
  {
    title: 'Marketplace preview',
    description: 'A new HP-powered drop zone for merch, bundles, and surprise campus activations.',
    cta: '/marketplace',
    icon: Store,
  },
];

const Home = ({ heroSlides }: { heroSlides: HeroSlide[] }) => {
  const { items, addItem, updateQuantity } = useCartStore();

  const handleAdd = (id: string) => {
    const item = MOCK_MENU.find((menuItem) => menuItem.id === id);
    if (!item) return;
    addItem({ id: item.id, menuItemId: item.id, name: item.name, price: item.price, imageUrl: item.imageUrl, hpValue: item.hpValue });
    toast.success(`${item.name} added to cart`);
  };

  return (
    <main className="flex flex-1 flex-col">
      <StoreClosedDialog />
      <HeroCarousel slides={heroSlides} />

      <section className="container mx-auto px-4 py-6">
        <StatusStrip />
      </section>

      <section className="container mx-auto grid gap-4 px-4 pb-8 md:grid-cols-[1.5fr,1fr]">
        <div className="rounded-3xl border border-border bg-card p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Campus rhythm</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-foreground">Fast food, clear windows, zero guesswork.</h2>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground">
            Delivery windows, leaderboard teasers, and student-first experiences now live in one hub.
          </p>
        </div>
        <Link to="/leaderboard" className="rounded-3xl border border-primary/20 bg-primary/10 p-6 transition-colors hover:bg-primary/15">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Leaderboard teaser</p>
              <h3 className="mt-2 font-display text-2xl font-bold text-foreground">You&apos;re #3 this week</h3>
              <p className="mt-2 text-sm text-muted-foreground">Catch Funmilayo before the weekly prize drop closes.</p>
            </div>
            <Trophy className="text-primary" />
          </div>
          <div className="mt-4 space-y-2">
            {LEADERBOARD_ENTRIES.slice(0, 3).map((entry, index) => (
              <div key={entry.id} className="flex items-center justify-between rounded-2xl bg-background/80 px-3 py-2 text-sm">
                <span className="font-semibold text-foreground">#{index + 1} {entry.name}</span>
                <span className="text-primary">{entry.hp} HP</span>
              </div>
            ))}
          </div>
        </Link>
      </section>

      <section className="container mx-auto px-4 py-8">
        <SectionHeader
          eyebrow="Featured now"
          title="Popular right now"
          description="Server-rendered favourites from the Holy Grills kitchen."
          action={<Link to="/menu" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">View full menu <ArrowRight size={14} /></Link>}
        />
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED.map((item) => (
            <FoodCard
              key={item.id}
              {...item}
              quantityInCart={getCartQuantityForMenuItem(items, item.id)}
              onAddToCart={handleAdd}
              onUpdateQuantity={(_, quantity) => updateQuantity(getPrimaryCartLineId(items, item.id), quantity)}
            />
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <SectionHeader eyebrow="Explore" title="Beyond the menu" description="Reusable promo cards ready for backend-driven content slots." />
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {EXPERIENCES.map((card) => (
            <Link key={card.title} to={card.cta} className="rounded-3xl border border-border bg-card p-6 transition-transform hover:-translate-y-0.5">
              <card.icon className="text-primary" />
              <h3 className="mt-4 font-display text-xl font-bold text-foreground">{card.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{card.description}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">Open <ArrowRight size={14} /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <div className="rounded-[2rem] bg-gradient-fire px-6 py-10 text-primary-foreground md:px-10">
          <div className="grid gap-6 md:grid-cols-[1.3fr,1fr] md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-foreground/80">Holy Points</p>
              <h2 className="mt-2 font-display text-3xl font-bold">Eat, earn, rise.</h2>
              <p className="mt-3 max-w-xl text-sm text-primary-foreground/80">Track HP, unlock perks, and review every order for bonus points.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { label: 'Every order', helper: 'Earn HP on every checkout', icon: Flame },
                { label: 'Review reward', helper: '+10 HP after meal feedback', icon: ShoppingBag },
              ].map((item) => (
                <div key={item.label} className="rounded-3xl bg-white/10 p-4 backdrop-blur">
                  <item.icon size={18} />
                  <p className="mt-3 font-semibold">{item.label}</p>
                  <p className="mt-1 text-sm text-primary-foreground/80">{item.helper}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
