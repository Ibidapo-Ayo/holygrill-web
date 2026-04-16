import { Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HPBadge } from '@/components/hp/HPBadge';
import { HPProgressBar } from '@/components/hp/HPProgressBar';
import { OrderCard } from '@/components/orders/OrderCard';
import { MOCK_ORDERS } from '@/data/mockOrders';
import { User, LogOut, ShoppingBag, ArrowRight, Settings, Flame, TrendingUp } from 'lucide-react';
import { formatPrice } from '@/data/menu';
import { motion } from 'framer-motion';

const userOrders = MOCK_ORDERS.filter((o) => o.userId === 'usr-001');
const totalSpent = userOrders.reduce((s, o) => s + o.total, 0);
const totalHP = userOrders.reduce((s, o) => s + o.hpEarned, 0);

const DashboardPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Profile header */}
          <div className="bg-card rounded-xl border border-border p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-fire flex items-center justify-center shrink-0">
                <User size={28} className="text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-display font-bold text-foreground text-xl">Adewale Johnson</h1>
                  <HPBadge value={142} size="md" variant="available" />
                </div>
                <p className="text-muted-foreground text-sm font-body mt-0.5">adewale@futa.edu.ng</p>
                <div className="mt-3">
                  <HPProgressBar currentHP={142} label="Holy Points Progress" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Orders', value: userOrders.length.toString(), icon: ShoppingBag, color: 'text-primary' },
              { label: 'Total Spent', value: formatPrice(totalSpent), icon: TrendingUp, color: 'text-primary' },
              { label: 'HP Earned', value: `${totalHP}`, icon: Flame, color: 'text-accent' },
              { label: 'HP Balance', value: '142', icon: Flame, color: 'text-success' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-card rounded-lg border border-border p-3 text-center"
              >
                <stat.icon size={16} className={`mx-auto mb-1 ${stat.color}`} />
                <p className="font-display font-bold text-foreground text-lg">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground font-body">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Recent orders */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-foreground text-lg">Recent Orders</h2>
              <Link to="/menu" className="text-primary text-sm font-body font-medium hover:underline flex items-center gap-1">
                Order More <ArrowRight size={14} />
              </Link>
            </div>
            <div className="space-y-3">
              {userOrders.length === 0 ? (
                <div className="bg-card rounded-lg border border-border p-8 text-center">
                  <ShoppingBag size={32} className="mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground font-body mb-3">No orders yet</p>
                  <Link to="/menu" className="text-primary text-sm font-body font-medium hover:underline">
                    Start ordering →
                  </Link>
                </div>
              ) : (
                userOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button className="py-3 rounded-lg bg-secondary text-foreground font-body font-medium text-sm hover:bg-border transition-colors flex items-center justify-center gap-2">
              <Settings size={16} /> Edit Profile
            </button>
            <Link to="/admin" className="py-3 rounded-lg bg-primary/10 text-primary font-body font-medium text-sm hover:bg-primary/20 transition-colors flex items-center justify-center gap-2">
              <ShoppingBag size={16} /> Admin Panel
            </Link>
            <button className="py-3 rounded-lg bg-destructive/10 text-destructive font-body font-medium text-sm hover:bg-destructive/20 transition-colors flex items-center justify-center gap-2">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DashboardPage;
