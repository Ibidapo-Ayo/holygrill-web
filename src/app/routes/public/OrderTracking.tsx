import { useState } from 'react';
import { useParams, Link, useNavigate } from '@/lib/router';
import { motion } from 'framer-motion';
import { StatusBar } from '@/components/orders/StatusBar';
import { CountdownTimer } from '@/components/orders/CountdownTimer';
import { HPBadge } from '@/components/hp/HPBadge';
import { formatPrice } from '@/data/menu';
import { MOCK_ORDERS } from '@/data/mockOrders';
import type { OrderStatus } from '@/types';
import { ArrowLeft, Phone, MapPin, Search } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

const GuestOrderLookup = () => {
  const [orderId, setOrderId] = useState('');
  const navigate = useNavigate();

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = orderId.trim();
    if (!trimmed) return;
    navigate(`/orders/${trimmed}`);
  };

  return (
    <main className="flex-1 md:pt-24 pb-12 flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-sm">
        <div className="bg-card border border-border rounded-2xl shadow-card p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Search size={28} className="text-primary" />
          </div>
          <div className="space-y-1">
            <h1 className="font-display font-bold text-foreground text-xl">Track Your Order</h1>
            <p className="text-sm text-muted-foreground font-body">Enter your Order ID to view the current status.</p>
          </div>
          <form onSubmit={handleLookup} className="space-y-3 text-left">
            <label className="text-xs text-muted-foreground font-body">Order ID</label>
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="e.g. ord-1234567890"
              required
              className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-gradient-fire text-primary-foreground font-display font-bold text-sm hover:opacity-90 transition-opacity"
            >
              Track Order
            </button>
          </form>
          <p className="text-xs text-muted-foreground font-body">
            Have an account?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>{' '}
            for full order history.
          </p>
        </div>
      </div>
    </main>
  );
};

const OrderTrackingPage = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuthStore();

  // For guests with no order ID in URL, show lookup form
  if (!isAuthenticated && !id) {
    return <GuestOrderLookup />;
  }

  const order = MOCK_ORDERS.find((o) => o.id === id) || MOCK_ORDERS[1]; // fallback to preparing order

  const timestamps = order.statusHistory.reduce((acc, event) => {
    acc[event.status] = event.timestamp;
    return acc;
  }, {} as Partial<Record<OrderStatus, string>>);

  const showTimer = order.status === 'preparing' || order.status === 'out_for_delivery';
  const isDelivered = order.status === 'delivered';

  return (
    <main className="flex-1 md:pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Link
          to={isAuthenticated ? '/dashboard' : '/orders'}
          className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm font-body mb-4 transition-colors"
        >
          <ArrowLeft size={14} /> {isAuthenticated ? 'Back to Dashboard' : 'Track another order'}
        </Link>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display font-bold text-foreground text-2xl">Order #{order.id}</h1>
            <p className="text-muted-foreground font-body text-sm">
              {new Date(order.createdAt).toLocaleDateString('en-NG', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          {isDelivered && <HPBadge value={order.hpEarned} size="lg" variant="earned" animated />}
        </div>

        <div className="space-y-4">
          <div className="bg-card rounded-xl border border-border p-6">
            <StatusBar currentStatus={order.status} timestamps={timestamps} />
          </div>

          {showTimer && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              <CountdownTimer etaTimestamp={order.estimatedDelivery} />
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="font-display font-bold text-foreground text-sm mb-3 flex items-center gap-2">
                <MapPin size={14} className="text-primary" /> Delivery Address
              </h3>
              <p className="text-sm text-foreground font-body">{order.address.streetAddress}</p>
              <p className="text-sm text-muted-foreground font-body">{order.address.city}</p>
              {order.address.landmark && (
                <p className="text-xs text-muted-foreground font-body mt-1">{order.address.landmark}</p>
              )}
              <div className="flex items-center gap-1.5 mt-3 text-primary">
                <Phone size={12} />
                <span className="text-xs font-body font-medium">{order.address.phone}</span>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="font-display font-bold text-foreground text-sm mb-3">Payment Summary</h3>
              <div className="space-y-2 text-sm font-body">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="text-foreground">{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery</span>
                  <span className="text-foreground">{formatPrice(order.deliveryFee)}</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between font-bold text-foreground">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(order.total)}</span>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground font-body mt-2">Ref: {order.paystackRef}</p>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="font-display font-bold text-foreground text-sm mb-4">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground font-body font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground font-body">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm text-foreground font-body font-semibold">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            {isDelivered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 pt-4 border-t border-border bg-success/5 -mx-5 -mb-5 px-5 py-4 rounded-b-xl"
              >
                <p className="text-xs text-success font-body font-medium mb-2">🎉 Order delivered! HP earned:</p>
                <HPBadge value={order.hpEarned} size="lg" variant="earned" animated />
              </motion.div>
            )}
          </div>

          {!isDelivered && (
            <div className="bg-card rounded-xl border border-border p-5">
              <p className="text-sm text-foreground font-display font-bold mb-1">Need to change anything?</p>
              <p className="text-xs text-muted-foreground font-body mb-3">Contact the rider directly for quick updates.</p>
              <div className="flex items-center gap-3">
                <Link
                  to="tel:+2348012345678"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-display font-bold text-xs hover:bg-primary/90 transition-colors"
                >
                  <Phone size={14} /> Call Rider
                </Link>
                <Link
                  to="/support"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-foreground font-display font-bold text-xs hover:bg-secondary transition-colors"
                >
                  Message Support
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default OrderTrackingPage;
