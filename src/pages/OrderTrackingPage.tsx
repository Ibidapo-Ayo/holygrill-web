import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { StatusBar } from '@/components/orders/StatusBar';
import { CountdownTimer } from '@/components/orders/CountdownTimer';
import { HPBadge } from '@/components/hp/HPBadge';
import { formatPrice } from '@/data/menu';
import { MOCK_ORDERS } from '@/data/mockOrders';
import type { OrderStatus } from '@/types';
import { ArrowLeft, Phone, MapPin } from 'lucide-react';

const OrderTrackingPage = () => {
  const { id } = useParams();
  const order = MOCK_ORDERS.find((o) => o.id === id) || MOCK_ORDERS[1]; // fallback to preparing order

  const timestamps = order.statusHistory.reduce((acc, event) => {
    acc[event.status] = event.timestamp;
    return acc;
  }, {} as Partial<Record<OrderStatus, string>>);

  const showTimer = order.status === 'preparing' || order.status === 'out_for_delivery';
  const isDelivered = order.status === 'delivered';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <Link to="/dashboard" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm font-body mb-4 transition-colors">
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-display font-bold text-foreground text-2xl">Order #{order.id}</h1>
              <p className="text-muted-foreground font-body text-sm">
                {new Date(order.createdAt).toLocaleDateString('en-NG', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            {isDelivered && <HPBadge value={order.hpEarned} size="lg" variant="earned" animated />}
          </div>

          {/* Status */}
          <div className="bg-card rounded-xl border border-border p-6 mb-4">
            <StatusBar currentStatus={order.status} timestamps={timestamps} />
          </div>

          {/* Countdown */}
          {showTimer && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-xl border border-border p-6 mb-4"
            >
              <CountdownTimer etaTimestamp={order.estimatedDelivery} />
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Delivery address */}
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="font-display font-bold text-foreground text-sm mb-3 flex items-center gap-2">
                <MapPin size={14} className="text-primary" /> Delivery Address
              </h3>
              <p className="text-sm text-foreground font-body">{order.address.streetAddress}</p>
              <p className="text-sm text-muted-foreground font-body">{order.address.city}</p>
              {order.address.landmark && <p className="text-xs text-muted-foreground font-body mt-1">{order.address.landmark}</p>}
              <div className="flex items-center gap-1.5 mt-3 text-primary">
                <Phone size={12} />
                <span className="text-xs font-body font-medium">{order.address.phone}</span>
              </div>
            </div>

            {/* Payment info */}
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="font-display font-bold text-foreground text-sm mb-3">Payment Summary</h3>
              <div className="space-y-2 text-sm font-body">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span><span className="text-foreground">{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery</span><span className="text-foreground">{formatPrice(order.deliveryFee)}</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between font-bold text-foreground">
                  <span>Total</span><span className="text-primary">{formatPrice(order.total)}</span>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground font-body mt-2">Ref: {order.paystackRef}</p>
            </div>
          </div>

          {/* Order items */}
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
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderTrackingPage;
