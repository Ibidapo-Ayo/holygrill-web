import { Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HPBadge } from '@/components/hp/HPBadge';
import { HPProgressBar } from '@/components/hp/HPProgressBar';
import { User, LogOut, ShoppingBag, ArrowRight } from 'lucide-react';
import { formatPrice } from '@/data/menu';

const MOCK_ORDERS = [
  { id: '1', items: 'Holy Smash Burger × 2, Loaded Fries', total: 8800, status: 'delivered' as const, date: '2025-06-10', hpEarned: 38 },
  { id: '2', items: 'Suya Grill Platter, Chapman Delight', total: 5700, status: 'preparing' as const, date: '2025-06-12', hpEarned: 25 },
  { id: '3', items: 'Holy Combo', total: 5500, status: 'delivered' as const, date: '2025-06-08', hpEarned: 25 },
];

const statusColors: Record<string, string> = {
  placed: 'bg-muted text-muted-foreground',
  confirmed: 'bg-primary/10 text-primary',
  preparing: 'bg-accent/10 text-accent',
  out_for_delivery: 'bg-primary/10 text-primary',
  delivered: 'bg-success/10 text-success',
};

const DashboardPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Profile header */}
          <div className="bg-card rounded-lg border border-border p-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <User size={24} className="text-primary" />
              </div>
              <div className="flex-1">
                <h1 className="font-display font-bold text-foreground text-xl">John Doe</h1>
                <p className="text-muted-foreground text-sm font-body">john@futa.edu.ng</p>
              </div>
              <HPBadge value={142} size="md" variant="available" />
            </div>
            <div className="mt-5">
              <HPProgressBar currentHP={142} label="Your Holy Points" />
            </div>
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
              {MOCK_ORDERS.map((order) => (
                <Link key={order.id} to={`/orders/${order.id}`} className="block bg-card rounded-lg border border-border p-4 hover:border-primary/30 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-body font-medium text-foreground text-sm truncate">{order.items}</p>
                      <p className="text-xs text-muted-foreground font-body mt-1">{order.date}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-body font-bold text-foreground text-sm">{formatPrice(order.total)}</span>
                      <div className="mt-1">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-body font-medium capitalize ${statusColors[order.status]}`}>
                          {order.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                  {order.status === 'delivered' && (
                    <div className="mt-2 pt-2 border-t border-border">
                      <HPBadge value={order.hpEarned} size="sm" variant="earned" />
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button className="flex-1 py-3 rounded-lg bg-secondary text-foreground font-body font-medium text-sm hover:bg-border transition-colors flex items-center justify-center gap-2">
              <ShoppingBag size={16} /> Edit Profile
            </button>
            <button className="flex-1 py-3 rounded-lg bg-destructive/10 text-destructive font-body font-medium text-sm hover:bg-destructive/20 transition-colors flex items-center justify-center gap-2">
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
