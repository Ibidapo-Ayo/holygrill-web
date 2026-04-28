import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from '@/lib/router';
import { ArrowLeft, CheckCircle2, Clock, Flame, Heart, Minus, Plus, ShoppingBag, Truck } from 'lucide-react';
import { MOCK_MENU, formatPrice } from '@/data/menu';
import { useCartStore } from '@/stores/cartStore';
import { FoodCard } from '@/components/menu/FoodCard';
import { HPBadge } from '@/components/hp/HPBadge';
import { toast } from 'sonner';

const MenuItemDetail = () => {
  const { menuId } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const { items, addItem, updateQuantity } = useCartStore();

  const item = useMemo(() => MOCK_MENU.find((m) => m.id === menuId), [menuId]);
  const related = useMemo(() => {
    if (!item) return [];
    return MOCK_MENU.filter((m) => m.category === item.category && m.id !== item.id).slice(0, 3);
  }, [item]);

  // Reset selections whenever the viewed item changes
  useEffect(() => {
    setSelectedSize(item?.sizes?.[0] ?? null);
    setSelectedExtras([]);
    setQuantity(1);
  }, [item]);

  if (!item) {
    return (
      <main className="flex-1 md:pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-3xl text-center space-y-4">
          <p className="text-lg font-display font-bold text-foreground">Item not found</p>
          <p className="text-sm text-muted-foreground font-body">The menu item you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/menu')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-display font-bold text-sm hover:bg-primary-hover transition-colors"
          >
            Back to Menu
          </button>
        </div>
      </main>
    );
  }

  const existingQty = items.find((i) => i.id === item.id)?.quantity ?? 0;

  // Accumulate price of selected extras
  const extrasTotal = selectedExtras.reduce((acc, extTitle) => {
    const ext = item.extras?.find((e) => e.title === extTitle);
    return acc + (ext?.price ?? 0);
  }, 0);

  const unitPrice = item.price + extrasTotal;
  const total = unitPrice * quantity;
  const hpTotal = item.hpValue * quantity;

  const handleAdd = () => {
    if (!item.isAvailable) return;
    if (!existingQty) {
      addItem({
        id: item.id,
        name: item.name,
        price: item.price,
        imageUrl: item.imageUrl,
        hpValue: item.hpValue,
      });
    }
    updateQuantity(item.id, existingQty + quantity);
    toast.success(`${item.name} added to cart`, {
      description: `${quantity} × ${formatPrice(item.price)} • +${hpTotal} HP`,
    });
  };

  const toggleExtra = (title: string) => {
    setSelectedExtras((prev) =>
      prev.includes(title) ? prev.filter((e) => e !== title) : [...prev, title]
    );
  };

  return (
    <main className="flex-1 md:pt-16 pb-16">

      {/* ═══════════════════════════════════════════════════════
          DESKTOP LAYOUT — sticky image left + purchase panel right
          Visible only on lg and above.
          ═══════════════════════════════════════════════════════ */}
      <div className="hidden lg:flex items-start">

        {/* Left: sticky full-height image column */}
        <div className="sticky top-16 w-[52%] shrink-0 h-[calc(100vh-4rem)]">
          <div className="relative h-full overflow-hidden">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            {/* Dual-direction gradient for top & bottom overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70" />

            {/* Back + heart buttons (top-left / top-right) */}
            <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 text-sm font-body text-white/90 bg-black/30 backdrop-blur-sm px-3 py-2 rounded-full hover:bg-black/50 transition-colors"
              >
                <ArrowLeft size={14} />
                Back
              </button>
              <button
                aria-label="Save to favourites"
                className="w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white/90 hover:bg-black/50 transition-colors"
              >
                <Heart size={16} />
              </button>
            </div>

            {/* Category pill + name + tagline overlaid at image bottom */}
            <div className="absolute bottom-0 left-0 right-0 px-8 pb-8">
              <span className="inline-block text-[10px] font-body font-semibold text-white/70 uppercase tracking-widest bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full mb-3">
                {item.category}
              </span>
              <h1 className="font-display font-extrabold text-white text-4xl xl:text-5xl leading-tight drop-shadow-lg">
                {item.name}
              </h1>
              {item.tagLine && (
                <p className="text-white/75 font-body italic mt-2 text-base leading-relaxed">
                  {item.tagLine}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right: scrollable purchase panel */}
        <div className="flex-1 min-h-[calc(100vh-4rem)]">
          <div className="max-w-lg xl:max-w-xl mx-auto px-10 xl:px-12 py-10 space-y-7">

            {/* Price + discount badges + HP badge + availability */}
            <div className="space-y-3">
              <div className="flex items-end gap-3 flex-wrap">
                <span className="font-display font-extrabold text-5xl text-primary leading-none">
                  {formatPrice(item.price)}
                </span>
                {item.slashedPrice && (
                  <span className="text-xl text-muted-foreground line-through font-body mb-1">
                    {formatPrice(item.slashedPrice)}
                  </span>
                )}
                {item.percentageOff && (
                  <span className="text-xs font-bold bg-success/15 text-success px-2.5 py-1 rounded-full mb-1">
                    {item.percentageOff}% off
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <HPBadge value={item.hpValue} variant="available" size="md" />
                {item.isAvailable ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-body text-success bg-success/10 px-3 py-1 rounded-full">
                    <CheckCircle2 size={11} />
                    Available now
                  </span>
                ) : (
                  <span className="text-xs font-body text-destructive bg-destructive/10 px-3 py-1 rounded-full">
                    Unavailable
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-[10px] font-body font-semibold text-muted-foreground uppercase tracking-widest mb-2">
                About this dish
              </p>
              <p className="text-muted-foreground font-body leading-relaxed text-base">
                {item.description}
              </p>
            </div>

            {/* Size selector — shown only when sizes exist */}
            {item.sizes && item.sizes.length > 0 && (
              <div>
                <p className="text-[10px] font-body font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                  Choose Size
                </p>
                <div className="flex gap-2">
                  {item.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`w-12 h-12 rounded-xl text-sm font-display font-bold border-2 transition-all ${
                        selectedSize === s
                          ? 'border-primary bg-primary text-primary-foreground shadow-glow'
                          : 'border-border bg-secondary text-foreground hover:border-primary/50'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Extras / add-ons — shown only when extras exist */}
            {item.extras && item.extras.length > 0 && (
              <div>
                <p className="text-[10px] font-body font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                  Add Extras
                </p>
                <div className="space-y-2">
                  {item.extras.map((ext) => {
                    const isSelected = selectedExtras.includes(ext.title);
                    return (
                      <button
                        key={ext.title}
                        onClick={() => toggleExtra(ext.title)}
                        className={`w-full flex items-center justify-between gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                          isSelected
                            ? 'border-primary bg-primary/5'
                            : 'border-border bg-card hover:border-primary/40'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={ext.imageUrl}
                            alt={ext.title}
                            className="w-10 h-10 rounded-lg object-cover shrink-0"
                          />
                          <span className="font-body font-medium text-sm text-foreground">
                            {ext.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-sm font-display font-bold text-primary">
                            +{formatPrice(ext.price)}
                          </span>
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${
                              isSelected ? 'bg-primary border-primary' : 'border-border'
                            }`}
                          >
                            {isSelected && (
                              <CheckCircle2 size={11} className="text-primary-foreground" />
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <hr className="border-border" />

            {/* Quantity stepper + live order total */}
            <div className="flex items-center justify-between gap-6">
              <div>
                <p className="text-[10px] font-body font-semibold text-muted-foreground uppercase tracking-widest mb-2">
                  Quantity
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-11 h-11 rounded-xl bg-secondary border border-border flex items-center justify-center hover:bg-border transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-2xl font-display font-bold min-w-[2.5ch] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-11 h-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary-hover transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-body font-semibold text-muted-foreground uppercase tracking-widest mb-1">
                  Order Total
                </p>
                <p className="text-4xl font-display font-extrabold text-foreground leading-none">
                  {formatPrice(total)}
                </p>
                <p className="text-xs font-body text-accent flex items-center gap-1 justify-end mt-1.5">
                  <Flame size={11} />
                  +{hpTotal} HP earned
                </p>
              </div>
            </div>

            {/* Delivery info strip */}
            <div className="flex items-center gap-5 bg-secondary/60 rounded-xl px-4 py-3 text-sm font-body text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Truck size={15} className="text-primary shrink-0" />
                <span>~20–25 min delivery</span>
              </div>
              <span className="text-border select-none">·</span>
              <div className="flex items-center gap-1.5">
                <Clock size={15} className="text-primary shrink-0" />
                <span>Peak hours may vary</span>
              </div>
            </div>

            {/* Primary CTA — shows running total */}
            <div className="space-y-2">
              <button
                onClick={handleAdd}
                disabled={!item.isAvailable}
                className="w-full inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-fire text-primary-foreground font-display font-extrabold py-4 text-base hover:opacity-90 transition-opacity disabled:opacity-50 shadow-glow"
              >
                <ShoppingBag size={18} />
                Add to Cart — {formatPrice(total)}
              </button>
              {existingQty > 0 && (
                <p className="text-xs text-muted-foreground font-body text-center">
                  {existingQty} already in cart · adding {quantity} more
                </p>
              )}
            </div>

            {/* HP Perks callout */}
            <div className="rounded-xl border border-accent/25 bg-accent/5 p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Flame size={15} className="text-accent" />
                <p className="text-sm font-display font-bold text-foreground">Holy Points Perks</p>
              </div>
              <ul className="text-xs text-muted-foreground font-body space-y-1 pl-0.5">
                <li>· +{item.hpValue} HP earned per unit ordered</li>
                <li>· HP accumulates across all your orders</li>
                <li>· Redeem HP for free food & exclusive rewards</li>
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          MOBILE LAYOUT — stacked card (unchanged from original)
          Visible below lg breakpoint.
          ═══════════════════════════════════════════════════════ */}
      <div className="lg:hidden">
        <div className="relative w-full overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="flex items-center justify-between py-4">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft size={16} /> Back
              </button>
              <HPBadge value={item.hpValue} variant="available" />
            </div>
          </div>
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="relative rounded-3xl overflow-hidden border border-border bg-card shadow-card">
              <div className="relative h-72 md:h-80">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground font-body uppercase tracking-wide">
                    {item.category}
                  </p>
                  <h1 className="font-display font-bold text-foreground text-2xl leading-tight mt-1">
                    {item.name}
                  </h1>
                </div>
                <p className="text-sm text-muted-foreground font-body leading-relaxed">
                  {item.description}
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="px-3 py-1.5 rounded-lg bg-secondary text-foreground text-sm font-display font-bold">
                    {formatPrice(item.price)}
                  </div>
                  <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-xs font-body">
                    <Flame size={14} /> Earn {item.hpValue} HP each
                  </div>
                  {item.isAvailable ? (
                    <span className="text-xs font-body text-success bg-success/10 px-3 py-1 rounded-full">
                      Available
                    </span>
                  ) : (
                    <span className="text-xs font-body text-destructive bg-destructive/10 px-3 py-1 rounded-full">
                      Unavailable
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl border border-border bg-card/70">
                    <p className="text-xs text-muted-foreground font-body mb-2">Quantity</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-8 h-8 rounded-lg bg-secondary border border-border flex items-center justify-center hover:bg-border transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-base font-display font-bold min-w-[1.5ch] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity((q) => q + 1)}
                        className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary-hover transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl border border-border bg-card/70">
                    <p className="text-xs text-muted-foreground font-body mb-1">Total</p>
                    <p className="text-lg font-display font-bold text-foreground">
                      {formatPrice(total)}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-body">+{hpTotal} HP</p>
                  </div>
                  <div className="p-4 rounded-xl border border-border bg-card/70">
                    <p className="text-xs text-muted-foreground font-body mb-1">Delivery</p>
                    <p className="text-sm font-body text-foreground">~20-25 min</p>
                    <p className="text-[10px] text-muted-foreground font-body">Peak may vary</p>
                  </div>
                </div>
                <button
                  onClick={handleAdd}
                  disabled={!item.isAvailable}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground font-display font-bold py-3 text-sm hover:bg-primary-hover transition-colors disabled:opacity-60"
                >
                  <ShoppingBag size={16} />
                  Add to Cart
                </button>
                {existingQty > 0 && (
                  <p className="text-xs text-muted-foreground font-body text-center">
                    You already have {existingQty} in cart. Adding {quantity} more.
                  </p>
                )}
                <div className="p-4 rounded-xl border border-border bg-secondary/50 space-y-2">
                  <p className="text-sm font-display font-bold text-foreground">HP Perks</p>
                  <ul className="text-xs text-muted-foreground font-body space-y-1 list-disc list-inside">
                    <li>+{item.hpValue} HP per unit</li>
                    <li>HP adds up across orders</li>
                    <li>Redeem HP for rewards anytime</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related items — visible at all breakpoints */}
      {related.length > 0 && (
        <section className="container mx-auto px-4 max-w-5xl mt-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-foreground text-xl">You might also like</h2>
            <button
              onClick={() => navigate('/menu')}
              className="text-sm text-primary font-body font-medium hover:underline"
            >
              Back to menu
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {related.map((rel) => (
              <FoodCard
                key={rel.id}
                {...rel}
                quantityInCart={items.find((i) => i.id === rel.id)?.quantity}
                onAddToCart={(id) => {
                  const found = MOCK_MENU.find((m) => m.id === id);
                  if (!found) return;
                  addItem({ id: found.id, name: found.name, price: found.price, imageUrl: found.imageUrl, hpValue: found.hpValue });
                  toast.success(`${found.name} added to cart`);
                }}
                onUpdateQuantity={(id, qty) => updateQuantity(id, qty)}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

export default MenuItemDetail;
