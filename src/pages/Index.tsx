import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, ArrowRight, Zap, Trophy, Gift } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FoodCard } from '@/components/menu/FoodCard';
import { useCartStore } from '@/stores/cartStore';
import { MOCK_MENU, formatPrice } from '@/data/menu';
import { toast } from 'sonner';

const FEATURED = MOCK_MENU.filter((i) => i.isAvailable).slice(0, 4);

const Index = () => {
  const { items, addItem, updateQuantity } = useCartStore();

  const handleAdd = (id: string) => {
    const item = MOCK_MENU.find((m) => m.id === id);
    if (!item) return;
    addItem({ id: item.id, name: item.name, price: item.price, imageUrl: item.imageUrl, hpValue: item.hpValue });
    toast.success(`${item.name} added to cart 🔥`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Flame size={14} className="text-primary" />
              <span className="text-xs font-body font-medium text-primary">FUTA's #1 Food Platform</span>
            </div>

            <h1 className="font-display font-extrabold text-4xl md:text-6xl lg:text-7xl text-foreground leading-[1.05] mb-6">
              Every Meal,{' '}
              <span className="text-gradient-fire">Every Point,</span>{' '}
              Every Moment.
            </h1>

            <p className="font-body text-muted-foreground text-base md:text-lg max-w-lg mb-8 leading-relaxed">
              Order delicious grills, earn Holy Points, and join the most vibrant food community on campus.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-gradient-fire text-primary-foreground font-display font-bold text-sm hover:opacity-90 transition-opacity shadow-glow"
              >
                Order Now
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-secondary text-foreground font-display font-bold text-sm hover:bg-border transition-colors"
              >
                Join for Free
              </Link>
            </div>
          </motion.div>
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
                Every order you place earns you Holy Points (HP). Climb the campus leaderboard, unlock exclusive rewards, and flex on the timeline. The more you eat, the more you earn.
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

      <Footer />
    </div>
  );
};

export default Index;
