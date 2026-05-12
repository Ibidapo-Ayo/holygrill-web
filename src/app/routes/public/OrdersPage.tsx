import { useEffect, useState } from 'react';
import { Clock, MapPin, Package, Phone, UserRound, Flame, MessageSquare, Search } from 'lucide-react';
import { Link, useNavigate } from '@/lib/router';
import { useAuthStore } from '@/stores/authStore';

const PROGRESS = [
  { title: 'Cooking your meal', description: 'Flavors are firing up in the kitchen!', Icon: Flame },
  { title: 'Rider en route to pickup', description: 'Zooming your flavors straight to you!', Icon: MapPin },
  { title: 'Arrived! Collect within 5 mins', description: 'Your order is ready at the counter.', Icon: Package },
];

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
    <main className="flex-1 md:pt-16 pb-12 flex items-center justify-center">
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

const OrdersPage = () => {
  const { isAuthenticated } = useAuthStore();
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev < PROGRESS.length - 1 ? prev + 1 : prev));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  if (!isAuthenticated) {
    return <GuestOrderLookup />;
  }

  return (
    <main className="flex-1 md:pt-16 pb-12">
      <div className="container mx-auto px-4 max-w-5xl space-y-8">
        <header className="flex flex-col gap-2">
          <h1 className="font-display font-bold text-foreground text-2xl md:text-3xl">Order ID: <span className="text-primary">HG1278</span></h1>
          <p className="text-sm text-muted-foreground font-body">Real-time view of your latest order.</p>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-[1.2fr,0.8fr] gap-6">
          <div className="bg-card border border-border rounded-2xl shadow-card p-5 md:p-7 space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { label: 'Item Qty', value: '5 items to be received' },
                { label: 'Total Price', value: '₦3,000' },
                { label: 'Batch Name', value: 'Batch B - South Gate' },
                { label: 'Delivery Type', value: 'Pickup Point' },
                { label: 'Personnel', value: 'Male, black cap & red shirt' },
                { label: 'Phone', value: '0801 234 5678' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-lg border border-border bg-secondary/50 p-3">
                  <p className="text-[11px] font-body text-muted-foreground uppercase tracking-wide">{stat.label}</p>
                  <p className="text-sm md:text-base font-display font-bold text-foreground mt-1 leading-snug">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex items-center gap-3 bg-secondary border border-border rounded-xl px-4 py-3">
                <Clock size={18} className="text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground font-body">ETA</p>
                  <p className="text-lg font-display font-bold text-foreground">~15:50 mins</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-secondary border border-border rounded-xl px-4 py-3 flex-1">
                <UserRound size={18} className="text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground font-body">Rider</p>
                  <p className="text-sm font-display font-bold text-foreground">“Emmanuel” • 0703 123 4567</p>
                </div>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="relative flex flex-col items-center">
                <div className="absolute left-1/2 -translate-x-1/2 w-px h-full bg-border" />
                <div className="relative flex flex-col gap-16 py-1 z-10">
                  {PROGRESS.map((_, index) => (
                    <div key={index} className="w-4 h-4 rounded-full border-2 border-primary bg-background" />
                  ))}
                </div>
                <div
                  className="absolute left-1/2 -translate-x-1/2 w-px bg-primary transition-all duration-500"
                  style={{ top: 0, height: `${(activeStage / (PROGRESS.length - 1)) * 100}%` }}
                />
              </div>

              <div className="flex-1 space-y-6">
                {PROGRESS.map((stage, index) => (
                  <div key={stage.title} className={`p-4 rounded-xl border ${index <= activeStage ? 'border-primary bg-primary/5' : 'border-border bg-secondary/40'} transition-all`}>
                    <div className="flex items-center gap-2 mb-1">
                      <stage.Icon size={16} className="text-primary" />
                      <p className="font-display font-bold text-foreground">{stage.title}</p>
                    </div>
                    <p className="text-sm text-muted-foreground font-body">{stage.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl shadow-card p-5 md:p-7 space-y-6">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground font-body">Track via WhatsApp</p>
              <div className="rounded-xl bg-secondary/60 border border-border p-4 space-y-2">
                <label className="text-xs text-muted-foreground font-body">WhatsApp Number</label>
                <input
                  type="text"
                  placeholder="e.g. 08012345678"
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-display font-bold text-sm hover:bg-primary-hover transition-colors">
                  Notify me on WhatsApp
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground font-body">Leave a review</p>
              <textarea
                placeholder="Write your review here..."
                className="w-full min-h-[120px] px-3 py-3 rounded-lg bg-secondary/60 border border-border text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-secondary text-foreground font-display font-bold text-sm hover:bg-border transition-colors">
                <MessageSquare size={16} />
                Submit Review
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default OrdersPage;
