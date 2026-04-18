import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore, selectSubtotal, selectTotalHP } from '@/stores/cartStore';
import { DELIVERY_FEE, formatPrice } from '@/data/menu';
import { Flame, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const CheckoutPage = () => {
  const { items, clearCart } = useCartStore();
  const subtotal = useCartStore(selectSubtotal);
  const totalHP = useCartStore(selectTotalHP);
  const total = subtotal + DELIVERY_FEE;
  const navigate = useNavigate();

  const [form, setForm] = useState({ streetAddress: '', city: 'Akure', landmark: '', phone: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.streetAddress.trim()) e.streetAddress = 'Address is required';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    else if (!/^0[789]\d{9}$/.test(form.phone.trim())) e.phone = 'Enter a valid Nigerian phone number';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePay = async () => {
    if (!validate()) return;
    setLoading(true);
    // Simulate payment
    await new Promise((r) => setTimeout(r, 2000));
    clearCart();
    toast.success('Order placed successfully! 🎉');
    navigate('/orders/demo-order');
    setLoading(false);
  };

  return (
    <main className="flex-1 md:pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="font-display font-bold text-foreground text-2xl md:text-3xl mb-8">Checkout</h1>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Form */}
          <div className="md:col-span-3 space-y-5">
            <div className="bg-card rounded-lg border border-border p-5 space-y-4">
              <h3 className="font-display font-bold text-foreground text-base">Delivery Address</h3>
              {[
                { key: 'streetAddress', label: 'Street Address', placeholder: 'e.g. Obakekere, behind FUTA gate' },
                { key: 'city', label: 'City', placeholder: 'Akure' },
                { key: 'landmark', label: 'Landmark (optional)', placeholder: 'Near...' },
                { key: 'phone', label: 'Phone Number', placeholder: '08012345678' },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-xs text-muted-foreground font-body mb-1">{field.label}</label>
                  <input
                    type="text"
                    value={form[field.key as keyof typeof form]}
                    onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  {errors[field.key] && <p className="text-destructive text-xs font-body mt-1">{errors[field.key]}</p>}
                </div>
              ))}
            </div>

            <div className="bg-card rounded-lg border border-border p-5">
              <h3 className="font-display font-bold text-foreground text-base mb-3">Payment</h3>
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
                  <span>Delivery</span><span className="text-foreground">{formatPrice(DELIVERY_FEE)}</span>
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
                disabled={loading}
                className="w-full py-3 rounded-lg bg-gradient-fire text-primary-foreground font-display font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <><Loader2 size={16} className="animate-spin" /> Processing...</> : `Pay ${formatPrice(total)}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CheckoutPage;
