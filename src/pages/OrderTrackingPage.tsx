import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { StatusBar } from '@/components/orders/StatusBar';
import { HPBadge } from '@/components/hp/HPBadge';
import { formatPrice } from '@/data/menu';
import type { OrderStatus } from '@/types';

const MOCK_ORDER = {
  id: 'demo-order',
  status: 'preparing' as OrderStatus,
  items: [
    { name: 'Holy Smash Burger', quantity: 2, price: 3500 },
    { name: 'Loaded Fries', quantity: 1, price: 1800 },
    { name: 'Chapman Delight', quantity: 1, price: 1200 },
  ],
  subtotal: 10000,
  deliveryFee: 500,
  total: 10500,
  hpEarned: 38,
  estimatedDelivery: new Date(Date.now() + 25 * 60 * 1000).toISOString(),
  statusHistory: {
    placed: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    confirmed: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    preparing: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
  } as Partial<Record<OrderStatus, string>>,
};

const OrderTrackingPage = () => {
  const eta = new Date(MOCK_ORDER.estimatedDelivery);
  const minsLeft = Math.max(0, Math.round((eta.getTime() - Date.now()) / 60000));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <h1 className="font-display font-bold text-foreground text-2xl mb-2">Order Tracking</h1>
          <p className="text-muted-foreground font-body text-sm mb-8">Order #{MOCK_ORDER.id.slice(0, 8)}</p>

          {/* Status */}
          <div className="bg-card rounded-lg border border-border p-6 mb-6">
            <StatusBar currentStatus={MOCK_ORDER.status} timestamps={MOCK_ORDER.statusHistory} />
          </div>

          {/* ETA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-lg border border-border p-5 mb-6 text-center"
          >
            <p className="text-muted-foreground font-body text-xs mb-1">Estimated delivery</p>
            <p className="font-display font-bold text-foreground text-3xl">
              {minsLeft > 2 ? `${minsLeft} min` : 'Arriving soon!'}
            </p>
            <p className="text-muted-foreground font-body text-xs mt-1">
              {eta.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </motion.div>

          {/* Order details */}
          <div className="bg-card rounded-lg border border-border p-5 space-y-3">
            <h3 className="font-display font-bold text-foreground text-base">Order Details</h3>
            {MOCK_ORDER.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm font-body">
                <span className="text-muted-foreground">{item.quantity}× {item.name}</span>
                <span className="text-foreground">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className="border-t border-border pt-3 space-y-1.5">
              <div className="flex justify-between text-sm font-body text-muted-foreground">
                <span>Subtotal</span><span className="text-foreground">{formatPrice(MOCK_ORDER.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm font-body text-muted-foreground">
                <span>Delivery</span><span className="text-foreground">{formatPrice(MOCK_ORDER.deliveryFee)}</span>
              </div>
              <div className="flex justify-between font-bold text-foreground text-base font-body pt-1">
                <span>Total</span><span className="text-primary">{formatPrice(MOCK_ORDER.total)}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground font-body mb-2">HP to earn on delivery:</p>
              <HPBadge value={MOCK_ORDER.hpEarned} size="md" variant="earned" animated />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderTrackingPage;
