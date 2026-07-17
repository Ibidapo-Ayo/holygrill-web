import { useEffect, useState } from 'react';
import { useNavigate, Link } from '@/lib/router';
import { useCartStore, selectSubtotal, selectTotalHP } from '@/stores/cartStore';
import { formatPrice } from '@/data/menu';
import { Flame, Mail, Phone, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { ActionSpinner } from '@/components/ui/ActionSpinner';
import { hasDeliveryInfo, hasPickupInfo, useFulfillmentStore } from '@/stores/fulfillmentStore';
import { useAuthStore } from '@/stores/authStore';
import { useCartQuery } from '@/hooks/useCart';
import { getCartErrorMessage } from '@/services/api/cart.service';

const CheckoutPage = () => {
  const { items } = useCartStore();
  const hasUnavailableItems = useCartStore((state) => state.hasUnavailableItems);
  const subtotal = useCartStore(selectSubtotal);
  const totalHP = useCartStore(selectTotalHP);
  const cartQuery = useCartQuery();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  const { estimatedDeliveryFee, method } = useFulfillmentStore();
  const deliveryReady = useFulfillmentStore(hasDeliveryInfo);
  const pickupReady = useFulfillmentStore(hasPickupInfo);
  const [loading, setLoading] = useState(false);

  // Guest contact info
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestContactError, setGuestContactError] = useState('');

  const deliveryFee = method === 'delivery' ? estimatedDeliveryFee : 0;
  const total = subtotal + deliveryFee;

  useEffect(() => {
    if (cartQuery.isLoading) {
      return;
    }

    if (items.length === 0) {
      navigate('/cart');
    }
  }, [cartQuery.isLoading, items.length, navigate]);

  if (cartQuery.isLoading) {
    return (
      <main className="flex-1 md:pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="rounded-lg border border-border bg-card p-5 text-sm text-muted-foreground">
            Loading checkout...
          </div>
        </div>
      </main>
    );
  }

  if (cartQuery.isError && items.length === 0) {
    return (
      <main className="flex-1 md:pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="rounded-lg border border-border bg-card p-5 text-sm text-muted-foreground">
            <p>{getCartErrorMessage(cartQuery.error, 'Unable to load your cart right now.')}</p>
            <button
              onClick={() => cartQuery.refetch()}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              <RefreshCw size={14} /> Retry
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (items.length === 0) return null;

  const canPay = !hasUnavailableItems && (method === 'delivery' ? deliveryReady : pickupReady);

  const handlePay = async () => {
    if (!isAuthenticated) {
      if (!guestEmail.trim() && !guestPhone.trim()) {
        setGuestContactError('Please enter your email or phone number so we can identify your order.');
        return;
      }
      setGuestContactError('');
    }
    if (!canPay) {
      toast.error('Please save your delivery or pickup info in cart first.');
      navigate('/cart');
      return;
    }
    setLoading(true);
    navigate('/payment/processing', {
      state: { total, method, hp: totalHP },
      replace: true,
    });
  };

  return (
    <main className="flex-1 md:pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="font-display font-bold text-foreground text-2xl md:text-3xl mb-8">Checkout</h1>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Fulfillment & payment */}
          <div className="md:col-span-3 space-y-5">

            {/* Guest contact (only shown if not authenticated) */}
            {!isAuthenticated && (
              <div className="bg-card rounded-lg border border-border p-5 space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground font-body uppercase tracking-wide">Guest Checkout</p>
                  <h3 className="font-display font-bold text-foreground text-base">Contact Info</h3>
                   <p className="text-xs text-muted-foreground font-body mt-1">
                     Provide your email or phone so we can track your order.{' '}
                     <Link to="/signup" className="text-primary hover:underline">Create an account</Link>{' '}
                     for full order history.
                   </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="flex items-center gap-1.5 text-xs text-muted-foreground font-body mb-1">
                      <Mail size={13} className="text-primary" /> Email
                    </label>
                    <input
                      type="email"
                      value={guestEmail}
                      onChange={(e) => { setGuestEmail(e.target.value); setGuestContactError(''); }}
                      placeholder="you@example.com"
                      className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-1.5 text-xs text-muted-foreground font-body mb-1">
                      <Phone size={13} className="text-primary" /> Phone
                    </label>
                    <input
                      type="tel"
                      value={guestPhone}
                      onChange={(e) => { setGuestPhone(e.target.value); setGuestContactError(''); }}
                      placeholder="08012345678"
                      className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>
                {guestContactError && (
                  <p className="text-destructive text-xs font-body">{guestContactError}</p>
                )}
              </div>
            )}

            <div className="bg-card rounded-lg border border-border p-5 space-y-3">
              <p className="text-xs text-muted-foreground font-body uppercase tracking-wide">Fulfillment</p>
              <h3 className="font-display font-bold text-foreground text-base">Delivery or Pickup details are managed on cart</h3>
              <p className="text-sm text-muted-foreground">
                Current method: {method === 'delivery' ? 'Home Delivery' : 'Pickup Window'}.
              </p>
              <button
                onClick={() => navigate('/cart')}
                className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
              >
                Update details on cart
              </button>
            </div>

            <div className="bg-card rounded-lg border border-border p-5">
              <h3 className="font-display font-bold text-foreground text-base mb-3">Payment</h3>
              {hasUnavailableItems ? (
                <p className="mb-3 text-xs text-destructive">
                  Remove unavailable items from cart before payment.
                </p>
              ) : null}
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-secondary border border-primary/30">
                <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">₦</div>
                <span className="text-sm font-body text-foreground">Paystack — Cards, Bank Transfer, USSD</span>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="md:col-span-2">
            <div className="bg-card rounded-lg border border-border p-5 space-y-4 sticky top-24">
              <h3 className="font-display font-bold text-foreground text-base">Order Summary</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm font-body">
                    <span className="text-muted-foreground truncate mr-2">{item.quantity}× {item.name}</span>
                    <span className="text-foreground shrink-0">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-3 space-y-1.5 text-sm font-body">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span><span className="text-foreground">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>{method === 'pickup' ? 'Pickup' : 'Delivery'}</span>
                  <span className="text-foreground">{method === 'pickup' ? '₦0' : formatPrice(deliveryFee)}</span>
                </div>
                <div className="flex justify-between font-bold text-foreground text-base pt-1">
                  <span>Total</span><span className="text-primary">{formatPrice(total)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-accent/10 rounded-md px-3 py-2">
                <Flame size={14} className="text-accent" />
                <span className="text-xs font-body text-accent font-medium">+{totalHP} HP earned!</span>
              </div>

              <button
                onClick={handlePay}
                disabled={loading || !canPay}
                className="w-full py-3 rounded-lg bg-gradient-fire text-primary-foreground font-display font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <><ActionSpinner size="md" tone="light" /> Processing...</> : `Pay ${formatPrice(total)}`}
              </button>
              {!canPay && (
                <p className="text-xs text-destructive font-body text-center">
                  {hasUnavailableItems
                    ? 'Please remove unavailable items from cart first.'
                    : `Please save your ${method === 'delivery' ? 'delivery address' : 'pickup details'} first.`}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

    </main>
  );
};

export default CheckoutPage;
