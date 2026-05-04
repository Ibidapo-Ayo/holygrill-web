"use client";

/**
 * Home.tsx
 * ---------------------------------------------------------------------------
 * Main public homepage.
 *
 * heroSlides is fetched server-side in app/page.tsx (SSR) and passed in as a
 * prop, so the carousel renders with real content on the very first HTML
 * response — no client-side fetch needed.
 */

import { Link } from '@/lib/router';
import { motion } from 'framer-motion';
import { Flame, ArrowRight, Zap, Trophy, Gift, Star, Users, ShoppingBag, MapPin, Clock, ChevronRight } from 'lucide-react';
import { FoodCard } from '@/components/menu/FoodCard';
import { useCartStore } from '@/stores/cartStore';
import { MOCK_MENU } from '@/data/menu';
import { toast } from 'sonner';
import { HeroCarousel } from '@/components/hero/HeroCarousel';
import type { HeroSlide } from '@/types';

const FEATURED = MOCK_MENU.filter((i) => i.isAvailable).slice(0, 4);

const TESTIMONIALS = [
  { name: 'Adewale J.', text: 'Best burgers on campus, hands down. The HP system keeps me coming back!', rating: 5, hp: 142 },
  { name: 'Funmilayo A.', text: 'The Suya Grill Platter is unreal. Delivery was fast and the app is so clean.', rating: 5, hp: 285 },
  { name: 'Chinedu O.', text: 'Holy Combo for the win every time. Love tracking my HP too!', rating: 5, hp: 98 },
];

const STATS = [
  { icon: ShoppingBag, value: '10K+', label: 'Orders Delivered' },
  { icon: Users, value: '2.5K+', label: 'Happy Students' },
  { icon: Flame, value: '50K+', label: 'HP Distributed' },
  { icon: Clock, value: '22 min', label: 'Avg Delivery' },
];

const Home = ({ heroSlides }: { heroSlides: HeroSlide[] }) => {
  const { items, addItem, updateQuantity } = useCartStore();

  const handleAdd = (id: string) => {
    const item = MOCK_MENU.find((m) => m.id === id);
    if (!item) return;
    addItem({ id: item.id, name: item.name, price: item.price, imageUrl: item.imageUrl, hpValue: item.hpValue });
    toast.success(`${item.name} added to cart 🔥`);
  };

  return (
    <main className="flex-1 flex flex-col">
      {/* Hero Carousel – slides are fetched server-side (SSR) in app/page.tsx */}
      <HeroCarousel slides={heroSlides} />

      {/* Stats Banner */}
      <section className="border-y border-border bg-card/50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <stat.icon size={24} className="mx-auto text-primary mb-2" />
                <p className="font-display font-bold text-foreground text-2xl">{stat.value}</p>
                <p className="text-xs text-muted-foreground font-body mt-0.5">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display font-bold text-foreground text-2xl md:text-3xl">Popular Right Now</h2>
            <p className="text-muted-foreground font-body text-sm mt-1">Fan favorites from the Holy Grills kitchen</p>
          </div>
          <Link to="/menu" className="text-primary text-sm font-body font-medium hover:underline flex items-center gap-1">
            View All <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURED.map((item) => (
            <FoodCard
              key={item.id}
              {...item}
              quantityInCart={items.find((c) => c.id === item.id)?.quantity}
              onAddToCart={handleAdd}
              onUpdateQuantity={(id, qty) => updateQuantity(id, qty)}
            />
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-foreground text-2xl md:text-3xl">How It Works</h2>
          <p className="text-muted-foreground font-body text-sm mt-2 max-w-md mx-auto">Three simple steps to deliciousness</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {[
            { step: '01', icon: ShoppingBag, title: 'Browse & Order', desc: 'Explore our menu and add items to your cart' },
            { step: '02', icon: MapPin, title: 'We Deliver', desc: 'Fast delivery right to your hostel or lecture hall' },
            { step: '03', icon: Flame, title: 'Earn HP', desc: 'Every order earns Holy Points towards free food' },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative text-center p-6 rounded-xl bg-card border border-border"
            >
              <span className="font-display font-extrabold text-5xl text-primary/10 absolute top-3 right-4">{item.step}</span>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <item.icon size={24} className="text-primary" />
              </div>
              <h3 className="font-display font-bold text-foreground text-base mb-2">{item.title}</h3>
              <p className="text-xs text-muted-foreground font-body">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HP Explainer */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-card rounded-2xl border border-border p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-5">
                <Flame size={14} className="text-accent" />
                <span className="text-xs font-body font-medium text-accent">Holy Points</span>
              </div>
              <h2 className="font-display font-bold text-foreground text-2xl md:text-3xl mb-4">
                Eat. Earn. <span className="text-gradient-fire">Rise.</span>
              </h2>
              <p className="text-muted-foreground font-body text-sm leading-relaxed mb-6">
                Every order you place earns you Holy Points (HP). Climb the campus leaderboard, unlock exclusive rewards, and flex on the timeline.
              </p>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-gradient-gold text-accent-foreground font-display font-bold text-sm hover:opacity-90 transition-opacity"
              >
                Start Earning HP
                <Zap size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Flame, title: 'Earn on Orders', desc: 'Every ₦1 spent = HP earned' },
                { icon: Trophy, title: 'Leaderboard', desc: 'Compete with friends weekly' },
                { icon: Gift, title: 'Redeem Rewards', desc: 'Free food, merch & more' },
                { icon: Zap, title: 'Streak Bonus', desc: 'Order daily for bonus HP' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 rounded-xl bg-secondary/50 border border-border"
                >
                  <item.icon size={20} className="text-primary mb-2" />
                  <h4 className="font-display font-bold text-foreground text-sm">{item.title}</h4>
                  <p className="text-xs text-muted-foreground font-body mt-1">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="font-display font-bold text-foreground text-2xl md:text-3xl">What Students Say</h2>
          <p className="text-muted-foreground font-body text-sm mt-2">Join thousands of happy customers on campus</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={14} className="text-accent fill-accent" />
                ))}
              </div>
              <p className="text-sm text-foreground font-body leading-relaxed mb-4">"{t.text}"</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary font-body">{t.name[0]}</span>
                  </div>
                  <span className="text-xs text-foreground font-body font-medium">{t.name}</span>
                </div>
                <span className="text-[10px] text-accent font-body font-medium flex items-center gap-0.5">
                  <Flame size={10} /> {t.hp} HP
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-fire rounded-2xl p-8 md:p-12 text-center">
          <h2 className="font-display font-extrabold text-primary-foreground text-2xl md:text-4xl mb-4">
            Ready to Eat?
          </h2>
          <p className="text-primary-foreground/80 font-body text-sm md:text-base mb-6 max-w-md mx-auto">
            Join Holy Grills today and start earning HP with every order. Your taste buds will thank you.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-background text-foreground font-display font-bold text-sm hover:bg-background/90 transition-colors"
            >
              View Menu <ChevronRight size={16} />
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-primary-foreground/30 text-primary-foreground font-display font-bold text-sm hover:border-primary-foreground/60 transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
};

export default Home;
