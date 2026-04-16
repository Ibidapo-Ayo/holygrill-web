import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { MOCK_ORDERS } from '@/data/mockOrders';
import { formatPrice } from '@/data/menu';
import type { OrderStatus } from '@/types';
import { Eye, ChevronDown, Filter, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_OPTIONS: { value: string; label: string; color: string }[] = [
  { value: 'all', label: 'All Orders', color: '' },
  { value: 'placed', label: 'Placed', color: 'bg-muted text-muted-foreground' },
  { value: 'confirmed', label: 'Confirmed', color: 'bg-primary/10 text-primary' },
  { value: 'preparing', label: 'Preparing', color: 'bg-accent/10 text-accent' },
  { value: 'out_for_delivery', label: 'On the way', color: 'bg-primary/10 text-primary' },
  { value: 'delivered', label: 'Delivered', color: 'bg-success/10 text-success' },
];

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  placed: 'confirmed',
  confirmed: 'preparing',
  preparing: 'out_for_delivery',
  out_for_delivery: 'delivered',
};

const AdminOrders = () => {
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [orders, setOrders] = useState(MOCK_ORDERS);

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  const advanceStatus = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const next = NEXT_STATUS[o.status];
        if (!next) return o;
        return {
          ...o,
          status: next,
          statusHistory: [...o.statusHistory, { status: next, timestamp: new Date().toISOString() }],
        };
      })
    );
  };

  return (
    <AdminLayout title="Orders" subtitle={`${filtered.length} orders`}>
      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-body font-medium transition-all ${
              filter === opt.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-border'
            }`}
          >
            {opt.label}
            {opt.value !== 'all' && (
              <span className="ml-1.5 opacity-60">
                {orders.filter((o) => o.status === opt.value).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {/* Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 bg-secondary/30 border-b border-border text-xs font-body font-medium text-muted-foreground">
          <div className="col-span-2">Order ID</div>
          <div className="col-span-3">Items</div>
          <div className="col-span-2">Customer</div>
          <div className="col-span-1">Total</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Actions</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-border">
          {filtered.map((order) => {
            const statusOpt = STATUS_OPTIONS.find((s) => s.value === order.status);
            const nextStatus = NEXT_STATUS[order.status];
            const isExpanded = expandedId === order.id;

            return (
              <div key={order.id}>
                <div
                  className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-5 py-4 hover:bg-secondary/20 transition-colors cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}
                >
                  <div className="md:col-span-2 flex items-center gap-2">
                    <Package size={14} className="text-muted-foreground shrink-0 hidden md:block" />
                    <span className="font-body font-semibold text-foreground text-sm">#{order.id}</span>
                  </div>
                  <div className="md:col-span-3">
                    <p className="text-xs text-muted-foreground font-body truncate">
                      {order.items.map((i) => `${i.quantity}× ${i.name}`).join(', ')}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-xs text-foreground font-body">{order.address.phone}</p>
                    <p className="text-[10px] text-muted-foreground font-body truncate">{order.address.streetAddress}</p>
                  </div>
                  <div className="md:col-span-1">
                    <span className="font-body font-bold text-foreground text-sm">{formatPrice(order.total)}</span>
                  </div>
                  <div className="md:col-span-2">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-body font-medium ${statusOpt?.color}`}>
                      {statusOpt?.label}
                    </span>
                  </div>
                  <div className="md:col-span-2 flex items-center gap-2">
                    {nextStatus && (
                      <button
                        onClick={(e) => { e.stopPropagation(); advanceStatus(order.id); }}
                        className="px-2.5 py-1 rounded-md bg-primary text-primary-foreground text-[10px] font-body font-semibold hover:bg-primary-hover transition-colors"
                      >
                        → {STATUS_OPTIONS.find((s) => s.value === nextStatus)?.label}
                      </button>
                    )}
                    <ChevronDown size={14} className={`text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                {/* Expanded details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 py-4 bg-secondary/10 border-t border-border">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h4 className="text-xs font-body font-semibold text-foreground mb-2">Order Items</h4>
                            {order.items.map((item) => (
                              <div key={item.id} className="flex items-center gap-2 mb-2">
                                <img src={item.imageUrl} alt={item.name} className="w-8 h-8 rounded object-cover" />
                                <div>
                                  <p className="text-xs text-foreground font-body">{item.quantity}× {item.name}</p>
                                  <p className="text-[10px] text-muted-foreground font-body">{formatPrice(item.price * item.quantity)}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div>
                            <h4 className="text-xs font-body font-semibold text-foreground mb-2">Delivery</h4>
                            <p className="text-xs text-muted-foreground font-body">{order.address.streetAddress}</p>
                            <p className="text-xs text-muted-foreground font-body">{order.address.city}</p>
                            {order.address.landmark && <p className="text-xs text-muted-foreground font-body">{order.address.landmark}</p>}
                            <p className="text-xs text-foreground font-body font-medium mt-1">{order.address.phone}</p>
                          </div>
                          <div>
                            <h4 className="text-xs font-body font-semibold text-foreground mb-2">Status History</h4>
                            <div className="space-y-1.5">
                              {order.statusHistory.map((event) => (
                                <div key={event.status} className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                  <span className="text-[10px] text-foreground font-body capitalize">{event.status.replace('_', ' ')}</span>
                                  <span className="text-[10px] text-muted-foreground font-body">
                                    {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-sm text-muted-foreground font-body">No orders match this filter</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
