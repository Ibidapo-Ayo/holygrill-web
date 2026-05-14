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
import {
  HOME_EXPERIENCES,
  HOME_HOLY_POINTS_FEATURES,
  HOME_HOW_IT_WORKS,
  HOME_STATS,
  HOME_TESTIMONIALS,
} from '@/content/homeContent';

const FEATURED = MOCK_MENU.filter((item) => item.isAvailable).slice(0, 4);

const EXPERIENCE_ICONS = [CalendarDays, Store] as const;
const HP_ICONS = [Flame, Trophy, ShoppingBag, Flame] as const;

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
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Social proof</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-foreground">Real flame. Real flavour. 🔥</h2>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground">
            Built for students who care about flavour, consistency, and delivery that actually keeps to schedule.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {HOME_STATS.map((stat) => (
              <div key={stat.value} className="rounded-2xl border border-border bg-background/70 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">{stat.label}</p>
                <p className="mt-1 text-sm font-semibold text-foreground">{stat.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{stat.helper}</p>
              </div>
            ))}
          </div>
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
          eyebrow="Selar-aligned menu"
          title="Real Grill. Real Flavour. 🔥"
          description="Flame-grilled proteins + crispy sides — made with the Holy Flame Method, every single order."
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
        <SectionHeader eyebrow="Explore" title="Beyond the menu" description="Campus-first drops and experiences around the Holy Grills community." />
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {HOME_EXPERIENCES.map((card, index) => {
            const Icon = EXPERIENCE_ICONS[index % EXPERIENCE_ICONS.length];

            return (
            <Link key={card.title} to={card.cta} className="rounded-3xl border border-border bg-card p-6 transition-transform hover:-translate-y-0.5">
              <Icon className="text-primary" />
              <h3 className="mt-4 font-display text-xl font-bold text-foreground">{card.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{card.description}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">Open <ArrowRight size={14} /></span>
            </Link>
            );
          })}
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <SectionHeader
          eyebrow="How it works"
          title="From Order to Door. Simple. Real. Yours. 🔥"
          description="Every step keeps the same Holy Grills standard — clear window, clear updates, clear flavour."
        />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {HOME_HOW_IT_WORKS.map((step, index) => (
            <div key={step.title} className="rounded-3xl border border-border bg-card p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Step {index + 1}</p>
              <h3 className="mt-2 font-display text-xl font-bold text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <div className="rounded-[2rem] bg-gradient-fire px-6 py-10 text-primary-foreground md:px-10">
          <div className="grid gap-6 md:grid-cols-[1.3fr,1fr] md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-foreground/80">Holy Points</p>
              <h2 className="mt-2 font-display text-3xl font-bold">Eat. Earn. Come Back. 🔥</h2>
              <p className="mt-3 max-w-xl text-sm text-primary-foreground/80">
                Every Holy Grills order earns you Holy Points. Stack them. Climb the leaderboard. Unlock rewards.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {HOME_HOLY_POINTS_FEATURES.map((item, index) => {
                const Icon = HP_ICONS[index % HP_ICONS.length];

                return (
                <div key={item.label} className="rounded-3xl bg-white/10 p-4 backdrop-blur">
                  <Icon size={18} />
                  <p className="mt-3 font-semibold">{item.label}</p>
                  <p className="mt-1 text-sm text-primary-foreground/80">{item.helper}</p>
                </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <SectionHeader
          eyebrow="Testimonials"
          title="Real Students. Real Orders. Real Flavour. 🔥"
          description="Every review earned through open flame and genuine craft."
        />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {HOME_TESTIMONIALS.map((testimonial) => (
            <article key={testimonial.name} className="rounded-3xl border border-border bg-card p-6">
              <p className="text-sm leading-relaxed text-muted-foreground">“{testimonial.quote}”</p>
              <p className="mt-4 font-semibold text-foreground">{testimonial.name}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-14 pt-4">
        <div className="rounded-3xl border border-primary/20 bg-primary/10 p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Final call</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-foreground">Your Order Closes at 4PM. ⏰🔥</h2>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Real flame-grilled chicken, wings, kebabs + crispy sides. Delivered to your doorstep. Order now before the batch closes.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/menu" className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">
              Build My Plate 🔥
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground"
            >
              Join the Vibe — It&apos;s Free <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
