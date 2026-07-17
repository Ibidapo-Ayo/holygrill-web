import { useEffect, useMemo, useState } from 'react';
import { RefreshCw, ShoppingBag, Trash2 } from 'lucide-react';
import { useNavigate } from '@/lib/router';
import { CartItemCard } from '@/components/cart/CartItemCard';
import { CartSummary } from '@/components/cart/CartSummary';
import { EmptyCart } from '@/components/cart/EmptyCart';
import { ActionSpinner } from '@/components/ui/ActionSpinner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DELIVERY_FEE, formatPrice } from '@/data/menu';
import { useCartQuery, useClearCart, useRemoveCartItem, useUpdateCartItem } from '@/hooks/useCart';
import { useMenuItemsQuery } from '@/hooks/useMenu';
import { useAuthAddressesQuery } from '@/hooks/useAuthAddresses';
import { useDeliveryGatesQuery, useDeliveryHostelsQuery } from '@/hooks/useDeliveryLocations';
import { calculateDeliveryFee } from '@/lib/api/delivery';
import { calculateCartTotals } from '@/utils/pricing';
import { getCartErrorMessage } from '@/services/api/cart.service';
import { getDeliveryErrorMessage } from '@/services/api/delivery.service';
import { selectItemCount, selectSubtotal, selectTotalHP, useCartStore } from '@/stores/cartStore';
import { useFulfillmentStore } from '@/stores/fulfillmentStore';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';

const PROMO_CODES: Record<string, number> = {
  STUDENT10: 500,
  FREEDELIVERY: 500,
};

const CartPage = () => {
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<number>(0);
  const [guestCheckout, setGuestCheckout] = useState(false);
  const [draftNotes, setDraftNotes] = useState<Record<string, string>>({});
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
  const [redeemHP, setRedeemHP] = useState(true);
  const [deliveryLocationMode, setDeliveryLocationMode] = useState<'onCampus' | 'offCampus'>('onCampus');
  const [selectedHostel, setSelectedHostel] = useState('');
  const [selectedGate, setSelectedGate] = useState('');
  const [isCapturingLocation, setIsCapturingLocation] = useState(false);
  const [isCalculatingDeliveryFee, setIsCalculatingDeliveryFee] = useState(false);
  const [fulfillmentContact, setFulfillmentContact] = useState({
    name: '',
    contact: '',
    email: '',
    address: '',
    latitude: undefined as number | undefined,
    longitude: undefined as number | undefined,
  });
  const { hasUnavailableItems, items } = useCartStore();
  const itemCount = useCartStore(selectItemCount);
  const subtotal = useCartStore(selectSubtotal);
  const hpPreview = useCartStore(selectTotalHP);
  const clearCartMutation = useClearCart();
  const removeCartItemMutation = useRemoveCartItem();
  const updateCartItemMutation = useUpdateCartItem();
  const updateCartNotesMutation = useUpdateCartItem();
  const { user, isAuthenticated } = useAuthStore();
  const { deliveryInfo, estimatedDeliveryFee, clearDelivery, saveDelivery, setEstimatedDeliveryFee } = useFulfillmentStore();
  const cartQuery = useCartQuery();
  const addressesQuery = useAuthAddressesQuery();
  const deliveryGatesQuery = useDeliveryGatesQuery();
  const deliveryHostelsQuery = useDeliveryHostelsQuery();
  const menuQuery = useMenuItemsQuery();
  const menuItems = menuQuery.data ?? [];
  const deliveryGates = deliveryGatesQuery.data ?? [];
  const deliveryHostels = deliveryHostelsQuery.data ?? [];
  const selectedHostelOption = deliveryHostels.find((hostel) => hostel.id === selectedHostel);
  const selectedGateOption = deliveryGates.find((gate) => gate.id === selectedGate);

  useEffect(() => {
    if (!user) {
      return;
    }

    setFulfillmentContact((current) => ({
      name: current.name || user.full_name || '',
      contact: current.contact || user.phone || '',
      email: current.email || user.email || '',
      address: current.address,
      latitude: current.latitude,
      longitude: current.longitude,
    }));
  }, [user]);

  useEffect(() => {
    if (!deliveryInfo) {
      return;
    }

    setFulfillmentContact((current) => ({
      ...current,
      address: current.address || deliveryInfo.streetAddress || '',
      latitude: current.latitude ?? deliveryInfo.latitude,
      longitude: current.longitude ?? deliveryInfo.longitude,
    }));
  }, [deliveryInfo]);

  useEffect(() => {
    if (addressesQuery.isLoading || !addressesQuery.isFetched) {
      return;
    }

    const latestAddress = addressesQuery.data?.[0];

    if (!latestAddress) {
      if (deliveryInfo?.addressId) {
        clearDelivery();
      }
      return;
    }

    if (
      deliveryInfo?.addressId === latestAddress.id &&
      deliveryInfo.streetAddress === latestAddress.address_line &&
      deliveryInfo.city === latestAddress.city &&
      deliveryInfo.state === latestAddress.state &&
      deliveryInfo.label === latestAddress.label &&
      deliveryInfo.latitude === latestAddress.latitude &&
      deliveryInfo.longitude === latestAddress.longitude
    ) {
      return;
    }

    saveDelivery({
      addressId: latestAddress.id,
      streetAddress: latestAddress.address_line,
      city: latestAddress.city,
      state: latestAddress.state,
      landmark: latestAddress.landmark ?? '',
      label: latestAddress.label,
      isDefault: latestAddress.is_default,
      latitude: latestAddress.latitude,
      longitude: latestAddress.longitude,
    });

    void (async () => {
      try {
        const fee = await calculateDeliveryFee({
          delivery_location_id: latestAddress.id,
          delivery_type: 'on_campus',
          lat: latestAddress.latitude,
          lon: latestAddress.longitude,
        });
        setEstimatedDeliveryFee(fee);
      } catch {
        setEstimatedDeliveryFee(DELIVERY_FEE);
      }
    })();
  }, [
    addressesQuery.data,
    addressesQuery.isFetched,
    addressesQuery.isLoading,
    clearDelivery,
    deliveryInfo,
    saveDelivery,
    setEstimatedDeliveryFee,
  ]);

  useEffect(() => {
    if (deliveryLocationMode !== 'onCampus' || !selectedHostelOption) {
      return;
    }

    setEstimatedDeliveryFee(selectedHostelOption.deliveryFee);
  }, [deliveryLocationMode, selectedHostelOption, setEstimatedDeliveryFee]);

  useEffect(() => {
    if (deliveryLocationMode !== 'offCampus' || !selectedGateOption) {
      setIsCalculatingDeliveryFee(false);
      return;
    }

    if (!Number.isFinite(fulfillmentContact.latitude) || !Number.isFinite(fulfillmentContact.longitude)) {
      setEstimatedDeliveryFee(Math.max(Math.round(selectedGateOption.baseFee), Math.round(selectedGateOption.minFee)));
      setIsCalculatingDeliveryFee(false);
      return;
    }

    setIsCalculatingDeliveryFee(true);

    void (async () => {
      try {
        const fee = await calculateDeliveryFee({
          delivery_location_id: selectedGateOption.id,
          delivery_type: 'off_campus',
          lat: fulfillmentContact.latitude,
          lon: fulfillmentContact.longitude,
        });
        setEstimatedDeliveryFee(fee);
      } catch {
        setEstimatedDeliveryFee(Math.max(Math.round(selectedGateOption.baseFee), Math.round(selectedGateOption.minFee)));
      } finally {
        setIsCalculatingDeliveryFee(false);
      }
    })();
  }, [
    deliveryLocationMode,
    fulfillmentContact.latitude,
    fulfillmentContact.longitude,
    selectedGateOption,
    setEstimatedDeliveryFee,
  ]);

  const cartItemsForDisplay = useMemo(
    () => items.map((cartItem) => {
      const menuItemId = cartItem.menuItemId ?? cartItem.id;
      const menuItem = menuItems.find((entry) => entry.id === menuItemId);

      if (!menuItem) {
        return cartItem;
      }

      return {
        ...cartItem,
        menuItemId,
        name: menuItem.name,
        imageUrl: menuItem.imageUrl,
        price: menuItem.price,
        hpValue: menuItem.hpValue,
      };
    }),
    [items, menuItems],
  );

  const effectiveDeliveryFee = items.length ? estimatedDeliveryFee : 0;

  const availableHP = isAuthenticated ? (user?.hp_balance ?? 0) : 0;
  const walletBalance = isAuthenticated ? (user?.wallet_balance ?? 0) : 0;
  const hpRedemption = redeemHP && items.length ? Math.min(600, availableHP * 2) : 0;
  const calculatedTotals = useMemo(
    () => calculateCartTotals({ items: cartItemsForDisplay, deliveryFee: effectiveDeliveryFee, promoDiscount: appliedPromo, hpRedemption }),
    [appliedPromo, cartItemsForDisplay, effectiveDeliveryFee, hpRedemption],
  );
  const totals = {
    ...calculatedTotals,
    hpToEarn: hpPreview,
    subtotal,
  };

  const applyPromo = () => {
    const value = PROMO_CODES[promoCode.trim().toUpperCase()];
    if (!value) {
      toast.error('Promo code not recognised');
      return;
    }
    setAppliedPromo(value);
    toast.success('Promo applied successfully');
  };

  const handleQuantityUpdate = (itemId: string, quantity: number) => {
    updateCartItemMutation.mutate(
      {
        itemId,
        payload: { quantity },
      },
      {
        onError: (error) => {
          toast.error(getCartErrorMessage(error, 'Unable to update your cart right now.'));
        },
      },
    );
  };

  const handleRemoveItem = (itemId: string) => {
    removeCartItemMutation.mutate(itemId, {
      onError: (error) => {
        toast.error(getCartErrorMessage(error, 'Unable to remove this item right now.'));
      },
    });
  };

  const handleNotesBlur = (itemId: string, currentNotes?: string) => {
    const nextNotes = (draftNotes[itemId] ?? currentNotes ?? '').trim();
    const normalizedCurrentNotes = currentNotes?.trim() ?? '';

    if (nextNotes === normalizedCurrentNotes) {
      return;
    }

    updateCartNotesMutation.mutate(
      {
        itemId,
        payload: { notes: nextNotes },
      },
      {
        onError: (error) => {
          setDraftNotes((current) => ({
            ...current,
            [itemId]: currentNotes ?? '',
          }));
          toast.error(getCartErrorMessage(error, 'Unable to save your item note right now.'));
        },
      },
    );
  };

  const handleClearCart = () => {
    clearCartMutation.mutate(undefined, {
      onError: (error) => {
        toast.error(getCartErrorMessage(error, 'Unable to clear your cart right now.'));
      },
      onSuccess: () => {
        setDraftNotes({});
        setIsClearDialogOpen(false);
        toast.success('Cart cleared');
      },
    });
  };

  const handleCaptureLocation = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      toast.error('Location is not supported on this device/browser.');
      return;
    }

    setIsCapturingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        setFulfillmentContact((current) => ({
          ...current,
          latitude,
          longitude,
        }));

        setIsCapturingLocation(false);
        toast.success('Location captured successfully.');
      },
      () => {
        setIsCapturingLocation(false);
        toast.error('Unable to access your location. Please allow location permission and try again.');
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
      },
    );
  };

  const hasLocationSelection = deliveryLocationMode === 'onCampus'
    ? Boolean(selectedHostelOption)
    : Boolean(selectedGateOption);
  const hasCoordinates = Number.isFinite(fulfillmentContact.latitude) && Number.isFinite(fulfillmentContact.longitude);

  const canCheckout = Boolean(
    fulfillmentContact.name.trim() &&
    fulfillmentContact.contact.trim() &&
    fulfillmentContact.email.trim() &&
    fulfillmentContact.address.trim() &&
    hasLocationSelection &&
    (deliveryLocationMode === 'onCampus' || hasCoordinates),
  );

  return (
    <main className="flex-1 pb-12 md:pt-24">
      <div className="container mx-auto space-y-6 px-4">
        <div className="grid gap-8 lg:grid-cols-[1.2fr,0.8fr]">
          <div className="space-y-6">
            {hasUnavailableItems ? (
              <div className="rounded-3xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                One or more items in your cart are currently unavailable. Update or remove them before checkout.
              </div>
            ) : null}

            {cartQuery.isLoading && !cartQuery.data ? (
              <div className="space-y-4">
                {Array.from({ length: 2 }).map((_, index) => (
                  <div key={index} className="rounded-3xl border border-border bg-card p-5 text-sm text-muted-foreground">
                    Loading cart...
                  </div>
                ))}
              </div>
            ) : cartQuery.isError && !items.length ? (
              <div className="rounded-3xl border border-border bg-card p-6">
                <p className="text-sm text-muted-foreground">
                  {getCartErrorMessage(cartQuery.error, 'Unable to load your cart right now.')}
                </p>
                <button
                  onClick={() => cartQuery.refetch()}
                  className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                >
                  <RefreshCw size={14} /> Try again
                </button>
              </div>
            ) : items.length ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3 rounded-3xl border border-border bg-card px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{itemCount} item{itemCount === 1 ? '' : 's'} in your cart</p>
                    <p className="text-xs text-muted-foreground">
                      Prices and totals stay synchronized with the latest cart response.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsClearDialogOpen(true)}
                    className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-secondary"
                  >
                    <Trash2 size={14} /> Clear cart
                  </button>
                </div>

                {cartItemsForDisplay.map((item) => (
                  <CartItemCard
                    key={item.id}
                    mode="cart"
                    item={item}
                    quantity={item.quantity}
                    onIncrement={() => handleQuantityUpdate(item.id, item.quantity + 1)}
                    onDecrement={() => handleQuantityUpdate(item.id, item.quantity - 1)}
                    onRemove={() => handleRemoveItem(item.id)}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Notes</span>
                        {updateCartNotesMutation.isPending ? (
                          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                            <ActionSpinner size="sm" tone="muted" /> Saving
                          </span>
                        ) : null}
                      </div>
                      <Textarea
                        value={draftNotes[item.id] ?? item.notes ?? ''}
                        onBlur={() => handleNotesBlur(item.id, item.notes)}
                        onChange={(event) => {
                          setDraftNotes((current) => ({
                            ...current,
                            [item.id]: event.target.value,
                          }));
                        }}
                        maxLength={500}
                        placeholder="Optional note for this item"
                        className="min-h-[92px] rounded-2xl border-border bg-background/80"
                      />
                    </div>
                  </CartItemCard>
                ))}
              </div>
            ) : (
              <EmptyCart />
            )}

            {items.length ? (
              <div className="rounded-[2rem] border border-border bg-card p-5 space-y-4">
                <div className="rounded-3xl border border-border bg-background/80 p-4 space-y-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Contact Form</p>
                    <p className="text-sm text-foreground">Add your delivery details before checkout.</p>
                  </div>

                  <div className="grid gap-3 md:grid-cols-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Name</label>
                      <Input
                        value={fulfillmentContact.name}
                        onChange={(event) => setFulfillmentContact((current) => ({ ...current, name: event.target.value }))}
                        placeholder="Enter full name"
                        aria-label="Name"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Contact</label>
                      <Input
                        value={fulfillmentContact.contact}
                        onChange={(event) => setFulfillmentContact((current) => ({ ...current, contact: event.target.value }))}
                        placeholder="Enter phone number"
                        aria-label="Contact"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Email Address</label>
                      <Input
                        type="email"
                        value={fulfillmentContact.email}
                        onChange={(event) => setFulfillmentContact((current) => ({ ...current, email: event.target.value }))}
                        placeholder="Enter email address"
                        aria-label="Email address"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Address</label>
                    <Input
                      value={fulfillmentContact.address}
                      onChange={(event) => setFulfillmentContact((current) => ({ ...current, address: event.target.value }))}
                      placeholder="Enter your delivery address"
                      aria-label="Address"
                    />
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Delivery Location</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setDeliveryLocationMode('onCampus');
                          setSelectedGate('');
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold ${deliveryLocationMode === 'onCampus' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'}`}
                      >
                        On Campus
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDeliveryLocationMode('offCampus');
                          setSelectedHostel('');
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold ${deliveryLocationMode === 'offCampus' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'}`}
                      >
                        Off Campus
                      </button>
                    </div>

                    {deliveryLocationMode === 'onCampus' ? (
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground">Select Hostel</label>
                        <select
                          value={selectedHostel}
                          onChange={(event) => setSelectedHostel(event.target.value)}
                          disabled={deliveryHostelsQuery.isLoading}
                          className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          aria-label="Select hostel"
                        >
                          <option value="">Select hostel</option>
                          {deliveryHostels.map((hostel) => (
                            <option key={hostel.id} value={hostel.id}>{hostel.name} - {formatPrice(hostel.deliveryFee)}</option>
                          ))}
                        </select>
                        {deliveryHostelsQuery.isError ? (
                          <p className="text-xs text-destructive">
                            {getDeliveryErrorMessage(deliveryHostelsQuery.error, 'Unable to load active hostels right now.')}
                          </p>
                        ) : null}
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-muted-foreground">Select Gate</label>
                        <select
                          value={selectedGate}
                          onChange={(event) => setSelectedGate(event.target.value)}
                          disabled={deliveryGatesQuery.isLoading}
                          className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          aria-label="Select gate"
                        >
                          <option value="">Select gate</option>
                          {deliveryGates.map((gate) => (
                            <option key={gate.id} value={gate.id}>{gate.name}</option>
                          ))}
                        </select>
                        {deliveryGatesQuery.isError ? (
                          <p className="text-xs text-destructive">
                            {getDeliveryErrorMessage(deliveryGatesQuery.error, 'Unable to load active gates right now.')}
                          </p>
                        ) : null}
                        {!deliveryGatesQuery.isLoading && !deliveryGates.length ? (
                          <p className="text-xs text-muted-foreground">No active gates available right now.</p>
                        ) : null}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={handleCaptureLocation}
                      disabled={isCapturingLocation}
                      className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isCapturingLocation ? 'Capturing location...' : 'Use My Location'}
                    </button>

                    <span className="text-xs text-muted-foreground">
                      {Number.isFinite(fulfillmentContact.latitude) && Number.isFinite(fulfillmentContact.longitude)
                        ? `Coordinates: ${fulfillmentContact.latitude?.toFixed(6)}, ${fulfillmentContact.longitude?.toFixed(6)}`
                        : deliveryLocationMode === 'onCampus'
                          ? 'Coordinates optional for on-campus hostel delivery'
                          : 'Coordinates not captured yet'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="text-xs text-muted-foreground inline-flex items-center gap-2">
                    <span>Estimated delivery fee: {formatPrice(effectiveDeliveryFee)}</span>
                    {isCalculatingDeliveryFee ? <ActionSpinner size="sm" tone="muted" /> : null}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {canCheckout ? 'Details completed' : 'Complete details to continue'}
                  </span>
                </div>
              </div>
            ) : null}

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
                  <span className="text-muted-foreground">Wallet balance</span>
                  <span className="font-semibold text-foreground">{new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(walletBalance)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Available HP</span>
                  <span className="font-semibold text-foreground">{availableHP} HP</span>
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

          </div>

          <CartSummary
            subtotal={totals.subtotal}
            deliveryFee={effectiveDeliveryFee}
            promoDiscount={appliedPromo}
            hpRedemption={hpRedemption}
            total={totals.payableTotal}
            hpToEarn={totals.hpToEarn}
            checkoutLabel={guestCheckout ? 'Guest checkout' : 'Checkout'}
            isCheckoutDisabled={!items.length || !canCheckout}
            onCheckout={() => navigate('/checkout')}
          />
        </div>
      </div>

      <AlertDialog open={isClearDialogOpen} onOpenChange={setIsClearDialogOpen}>
        <AlertDialogContent className="max-w-sm rounded-[1.75rem] border-border p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-2xl text-foreground">Clear your cart?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes every item from your cart and updates totals across the app immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep items</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearCart}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Clear cart
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
};

export default CartPage;
