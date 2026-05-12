import { Link, useNavigate } from '@/lib/router';
import { HPBadge } from '@/components/hp/HPBadge';
import { HPProgressBar } from '@/components/hp/HPProgressBar';
import { OrderCard } from '@/components/orders/OrderCard';
import { MOCK_ORDERS } from '@/data/mockOrders';
import { User, LogOut, ShoppingBag, ArrowRight, Settings, Flame, TrendingUp } from 'lucide-react';
import { formatPrice } from '@/data/menu';
import { motion } from 'framer-motion';
import { useAuthStore, getInitials, safeImageUrl } from '@/stores/authStore';

const userOrders = MOCK_ORDERS.filter((o) => o.userId === 'usr-001');
const totalSpent = userOrders.reduce((s, o) => s + o.total, 0);
const totalHP = userOrders.reduce((s, o) => s + o.hpEarned, 0);

const AccountDashboardPage = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const displayName = user?.name ?? 'Guest';
  const displayEmail = user?.email ?? '';
  const initials = user ? getInitials(user.name) : 'G';

  return (
    <main className="flex-1 md:pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-4xl space-y-8">
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-fire flex items-center justify-center shrink-0 overflow-hidden">
              {safeImageUrl(user?.avatarUrl) ? (
                <img src={safeImageUrl(user!.avatarUrl)!} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-primary-foreground font-bold text-xl">{initials}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-display font-bold text-foreground text-xl">{displayName}</h1>
                <HPBadge value={142} size="md" variant="available" />
              </div>
              <p className="text-muted-foreground text-sm font-body mt-0.5">{displayEmail}</p>
              <div className="mt-3">
                <HPProgressBar currentHP={142} label="Holy Points Progress" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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

        <div className="space-y-3">
          <div className="flex items-center justify-between">
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
              userOrders.map((order) => <OrderCard key={order.id} order={order} />)
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            to="/profile"
            className="py-3 rounded-lg bg-secondary text-foreground font-body font-medium text-sm hover:bg-border transition-colors flex items-center justify-center gap-2"
          >
            <Settings size={16} /> Edit Profile
          </Link>
          <Link
            to="/admin"
            className="py-3 rounded-lg bg-primary/10 text-primary font-body font-medium text-sm hover:bg-primary/20 transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingBag size={16} /> Admin Panel
          </Link>
          <button
            onClick={handleLogout}
            className="py-3 rounded-lg bg-destructive/10 text-destructive font-body font-medium text-sm hover:bg-destructive/20 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
    </main>
  );
};

export default AccountDashboardPage;
