import { Flame, MapPin, Phone, RotateCcw, Star } from 'lucide-react';
import { Link, useParams } from '@/lib/router';
import { CountdownTimer } from '@/components/orders/CountdownTimer';
import { StatusBar } from '@/components/orders/StatusBar';
import { HPBadge } from '@/components/hp/HPBadge';
import { StatusStrip } from '@/components/shared/StatusStrip';
import { EmptyState } from '@/components/shared/EmptyState';
import { MOCK_ORDERS } from '@/data/mockOrders';
import { formatPrice } from '@/data/menu';
import type { OrderStatus } from '@/types';

const OrderTrackingPage = () => {
  const { id } = useParams<{ id: string }>();
  const order = MOCK_ORDERS.find((entry) => entry.id === id);

  if (!order) {
    return (
      <main className="flex-1 pb-12 md:pt-24">
        <div className="container mx-auto max-w-3xl px-4">
          <EmptyState icon={MapPin} title="Order not found" description="We couldn't find that order tracking record. Try opening it again from your orders list." ctaLabel="Back to orders" ctaTo="/orders" />
        </div>
      </main>
    );
  }
  const timestamps = order.statusHistory.reduce((accumulator, event) => {
    accumulator[event.status] = event.timestamp;
    return accumulator;
  }, {} as Partial<Record<OrderStatus, string>>);
  const showTimers = order.status === 'preparing' || order.status === 'out_for_delivery';
  const isDelivered = order.status === 'delivered';

  return (
    <main className="flex-1 pb-12 md:pt-24">
      <div className="container mx-auto max-w-4xl space-y-6 px-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Link to="/orders" className="text-sm font-semibold text-primary">← Back to orders</Link>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Track order #{order.id}</h1>
            <p className="mt-1 text-sm text-muted-foreground">Status-driven tracking, prep countdowns, rider details, and reorder actions all live here.</p>
          </div>
          {isDelivered ? <HPBadge value={order.hpEarned} size="lg" variant="earned" /> : null}
        </div>

        <StatusStrip compact />

        <div className="rounded-[2rem] border border-border bg-card p-6">
          <StatusBar currentStatus={order.status} timestamps={timestamps} />
        </div>

        {showTimers ? (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[2rem] border border-border bg-card p-6">
              <p className="mb-4 text-sm font-semibold text-foreground">Realtime delivery countdown</p>
              <CountdownTimer etaTimestamp={order.estimatedDelivery} />
            </div>
            {order.prepDeadline ? (
              <div className="rounded-[2rem] border border-border bg-card p-6">
                <p className="mb-4 text-sm font-semibold text-foreground">Preparation timer</p>
                <CountdownTimer etaTimestamp={order.prepDeadline} />
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="grid gap-4 lg:grid-cols-[1.05fr,0.95fr]">
          <div className="space-y-4">
            <div className="rounded-[2rem] border border-border bg-card p-5">
              <h2 className="font-display text-xl font-bold text-foreground">Order items</h2>
              <div className="mt-4 space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 rounded-2xl bg-secondary/50 p-3">
                    <img src={item.imageUrl} alt={item.name} className="h-14 w-14 rounded-2xl object-cover" />
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Qty {item.quantity}</p>
                    </div>
                    <span className="text-sm font-semibold text-foreground">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-border bg-card p-5">
              <h2 className="font-display text-xl font-bold text-foreground">Payment summary</h2>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span className="text-foreground">{formatPrice(order.subtotal)}</span></div>
                <div className="flex justify-between text-muted-foreground"><span>Delivery</span><span className="text-foreground">{formatPrice(order.deliveryFee)}</span></div>
                <div className="flex justify-between border-t border-border pt-2 font-bold text-foreground"><span>Total</span><span>{formatPrice(order.total)}</span></div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[2rem] border border-border bg-card p-5">
              <h2 className="font-display text-xl font-bold text-foreground">Rider info</h2>
              {order.rider ? (
                <div className="mt-4 space-y-3 text-sm">
                  <div className="rounded-2xl bg-secondary/50 p-4">
                    <p className="font-semibold text-foreground">{order.rider.name}</p>
                    <p className="mt-1 text-muted-foreground">{order.rider.vehicle}</p>
                    <p className="mt-1 text-muted-foreground">ETA: {order.rider.etaMinutes} mins</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link to={`tel:${order.rider.phone}`} className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"><Phone size={14} /> Call rider</Link>
                    <Link to="/support" className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground"><MapPin size={14} /> Contact support</Link>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-sm text-muted-foreground">Rider assignment will appear here once dispatch confirms the order.</p>
              )}
            </div>

            <div className="rounded-[2rem] border border-border bg-card p-5">
              <h2 className="font-display text-xl font-bold text-foreground">Next actions</h2>
              <div className="mt-4 space-y-3">
                <Link to="/menu" className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"><RotateCcw size={16} /> Reorder this basket</Link>
                {isDelivered ? (
                  <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border px-4 py-3 text-sm font-semibold text-foreground"><Star size={16} /> Leave a review for +10 HP</button>
                ) : (
                  <div className="rounded-2xl bg-secondary/60 p-4 text-sm text-muted-foreground">Review prompt unlocks automatically after delivery confirmation.</div>
                )}
                {isDelivered ? <div className="rounded-2xl bg-success/10 p-4 text-sm text-success"><Flame size={16} className="mb-2" /> Nice. This order credited +{order.hpEarned} HP.</div> : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default OrderTrackingPage;
