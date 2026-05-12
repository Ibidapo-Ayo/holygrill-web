import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Gift, Heart, ShoppingBag } from 'lucide-react';
import { useNavigate } from '@/lib/router';
import { CartItemCard } from '@/components/cart/CartItemCard';
import { CartSummary } from '@/components/cart/CartSummary';
import { EmptyCart } from '@/components/cart/EmptyCart';
import { StatusStrip } from '@/components/shared/StatusStrip';
import { EmptyState } from '@/components/shared/EmptyState';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { calculateCartTotals, createCartLineId } from '@/utils/pricing';
import { DELIVERY_FEE } from '@/data/menu';
import { MOCK_MENU } from '@/data/menu';
import { getCartSnapshot } from '@/services/api/cart.service';
import { useCartStore } from '@/stores/cartStore';
import { useFavouritesStore } from '@/stores/favouritesStore';
import { toast } from 'sonner';

const PROMO_CODES: Record<string, number> = {
  STUDENT10: 500,
  FREEDELIVERY: 500,
};

const CartPage = ({ initialTab = 'cart' }: { initialTab?: 'cart' | 'saved' }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'cart' | 'saved'>(initialTab);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<number>(0);
  const [walletEnabled, setWalletEnabled] = useState(true);
  const [guestCheckout, setGuestCheckout] = useState(false);
  const [notes, setNotes] = useState('No pepper on one bowl, please.');
  const [redeemHP, setRedeemHP] = useState(true);
  const { items, updateQuantity, removeItem, addItem } = useCartStore();
  const { items: savedItems, toggle } = useFavouritesStore();

  const { data } = useQuery({
    queryKey: ['cart-snapshot', items],
    queryFn: () => getCartSnapshot(items),
    initialData: { items, walletBalance: 8400, availableHP: 248 },
  });

  const hpRedemption = redeemHP && items.length ? Math.min(600, data.availableHP * 2) : 0;
  const walletApplied = walletEnabled && items.length ? Math.min(data.walletBalance, calculateCartTotals({ items, deliveryFee: DELIVERY_FEE, promoDiscount: appliedPromo, hpRedemption }).totalBeforeCredits) : 0;
  const totals = useMemo(
    () => calculateCartTotals({ items, deliveryFee: DELIVERY_FEE, promoDiscount: appliedPromo, hpRedemption, walletApplied }),
    [appliedPromo, hpRedemption, items, walletApplied]
  );

  const applyPromo = () => {
    const value = PROMO_CODES[promoCode.trim().toUpperCase()];
    if (!value) {
      toast.error('Promo code not recognised');
      return;
    }
    setAppliedPromo(value);
    toast.success('Promo applied successfully');
  };

  const moveSavedToCart = (item: (typeof savedItems)[number]) => {
    const sizeLabel = item.sizes?.[0]?.label;
    const lineId = createCartLineId(item.id, sizeLabel);
    addItem({ id: lineId, menuItemId: item.id, name: item.name, price: sizeLabel ? item.sizes?.[0]?.price ?? item.price : item.price, imageUrl: item.imageUrl, hpValue: item.hpValue, sizeLabel });
    toggle(item);
    toast.success(`${item.name} moved to cart`);
  };

  return (
    <main className="flex-1 pb-12 md:pt-24">
      <div className="container mx-auto space-y-6 px-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Checkout hub</p>
            <h1 className="mt-1 font-display text-3xl font-bold text-foreground">Cart & saved items</h1>
            <p className="mt-2 text-sm text-muted-foreground">Manage active checkout, saved dishes, wallet spend, promo codes, and guest checkout in one place.</p>
          </div>
          <div className="rounded-3xl border border-border bg-card px-4 py-3 text-sm">
            <p className="font-semibold text-foreground">HP earning preview</p>
            <p className="mt-1 text-muted-foreground">This basket projects +{totals.hpToEarn} HP before redemptions.</p>
          </div>
        </div>

        <StatusStrip compact />

        <div className="inline-flex rounded-full border border-border bg-card p-1">
          {[
            { key: 'cart', label: `My cart (${items.length})` },
            { key: 'saved', label: `Saved items (${savedItems.length})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as 'cart' | 'saved')}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${activeTab === tab.key ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr,0.8fr]">
          <div className="space-y-6">
            {activeTab === 'cart' ? (
              items.length ? (
                <div className="space-y-4">
                  {items.map((item) => (
                    <CartItemCard
                      key={item.id}
                      mode="cart"
                      item={item}
                      quantity={item.quantity}
                      onIncrement={() => updateQuantity(item.id, item.quantity + 1)}
                      onDecrement={() => updateQuantity(item.id, item.quantity - 1)}
                      onRemove={() => removeItem(item.id)}
                      onMoveToSaved={() => {
                        const menuItem = MOCK_MENU.find((entry) => entry.id === (item.menuItemId ?? item.id));
                        if (menuItem && !savedItems.some((entry) => entry.id === menuItem.id)) {
                          toggle(menuItem);
                        }
                        removeItem(item.id);
                        toast.success('Moved to saved items');
                      }}
                    />
                  ))}
                </div>
              ) : (
                <EmptyCart />
              )
            ) : savedItems.length ? (
              <div className="space-y-4">
                {savedItems.map((item) => (
                  <CartItemCard key={item.id} mode="saved" item={item} onMoveToCart={() => moveSavedToCart(item)} onRemove={() => toggle(item)} />
                ))}
              </div>
            ) : (
              <EmptyState icon={Heart} title="No saved items yet" description="Save dishes from the menu to keep them ready for the next delivery window." ctaLabel="Browse menu" ctaTo="/menu" />
            )}

            <div className="grid gap-4 rounded-[2rem] border border-border bg-card p-5 md:grid-cols-2">
              <div>
                <p className="text-sm font-semibold text-foreground">Promo code</p>
                <p className="mt-1 text-xs text-muted-foreground">Use codes like STUDENT10 or FREEDELIVERY.</p>
                <div className="mt-3 flex gap-2">
                  <Input value={promoCode} onChange={(event) => setPromoCode(event.target.value)} placeholder="Enter promo code" aria-label="Promo code" />
                  <button onClick={applyPromo} className="rounded-2xl bg-primary px-4 text-sm font-semibold text-primary-foreground">Apply</button>
                </div>
              </div>
              <div className="space-y-3 rounded-3xl bg-secondary/60 p-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Wallet payment</span>
                  <button onClick={() => setWalletEnabled((value) => !value)} className={`rounded-full px-3 py-1 text-xs font-semibold ${walletEnabled ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground'}`}>
                    {walletEnabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Redeem HP</span>
                  <button onClick={() => setRedeemHP((value) => !value)} className={`rounded-full px-3 py-1 text-xs font-semibold ${redeemHP ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground'}`}>
                    {redeemHP ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Guest checkout</span>
                  <button onClick={() => setGuestCheckout((value) => !value)} className={`rounded-full px-3 py-1 text-xs font-semibold ${guestCheckout ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground'}`}>
                    {guestCheckout ? 'Guest path' : 'Signed in'}
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-border bg-card p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground"><Gift size={16} className="text-primary" /> Order notes & fulfilment</div>
              <Textarea value={notes} onChange={(event) => setNotes(event.target.value)} className="mt-4 min-h-28" aria-label="Order notes" />
              <p className="mt-2 text-xs text-muted-foreground">Form structure is ready for future validation and backend submission.</p>
            </div>
          </div>

          <CartSummary
            subtotal={totals.subtotal}
            deliveryFee={items.length ? DELIVERY_FEE : 0}
            promoDiscount={appliedPromo}
            hpRedemption={hpRedemption}
            walletApplied={walletApplied}
            total={totals.payableTotal}
            hpToEarn={totals.hpToEarn}
            checkoutLabel={guestCheckout ? 'Guest checkout' : 'Checkout'}
            isCheckoutDisabled={!items.length}
            onCheckout={() => navigate('/checkout')}
          />
        </div>
      </div>
    </main>
  );
};

export default CartPage;
