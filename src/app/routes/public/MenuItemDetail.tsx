import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle2, Clock, Flame, Heart, MessageSquare, Minus, Plus, ShoppingBag, Star, Truck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from '@/lib/router';
import { FoodCard } from '@/components/menu/FoodCard';
import { HPBadge } from '@/components/hp/HPBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { StatusStrip } from '@/components/shared/StatusStrip';
import { MOCK_MENU, formatPrice } from '@/data/menu';
import { useCartStore } from '@/stores/cartStore';
import { useFavouritesStore } from '@/stores/favouritesStore';
import { createCartLineId, getCartQuantityForMenuItem, getConfiguredMenuPrice, getPrimaryCartLineId } from '@/utils/pricing';
import { toast } from 'sonner';

const MenuItemDetail = () => {
  const { menuId } = useParams<{ menuId: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [isDesktop, setIsDesktop] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 1024px)').matches : false
  );
  const { items, addItem, updateQuantity } = useCartStore();
  const { toggle: toggleFavourite, isFavourite } = useFavouritesStore();

  const item = useMemo(() => MOCK_MENU.find((entry) => entry.id === menuId), [menuId]);
  const related = useMemo(() => item ? MOCK_MENU.filter((entry) => entry.category === item.category && entry.id !== item.id).slice(0, 3) : [], [item]);
  const isSaved = item ? isFavourite(item.id) : false;

  useEffect(() => {
    if (!item) return;
    setSelectedSize(item.sizes?.[0]?.label ?? null);
    setSelectedExtras([]);
    setQuantity(1);
  }, [item]);

  useLayoutEffect(() => {
    const query = window.matchMedia('(min-width: 1024px)');
    const sync = () => setIsDesktop(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  if (!item) {
    return (
      <main className="flex-1 pb-12 md:pt-24">
        <div className="container mx-auto max-w-3xl px-4">
          <EmptyState icon={ShoppingBag} title="Item not found" description="This menu item is unavailable or has moved." ctaLabel="Back to menu" ctaTo="/menu" />
        </div>
      </main>
    );
  }

  const unitPrice = getConfiguredMenuPrice(item, selectedSize, selectedExtras);
  const total = unitPrice * quantity;
  const hpTotal = item.hpValue * quantity;
  const existingQty = getCartQuantityForMenuItem(items, item.id);

  const toggleExtra = (title: string) => setSelectedExtras((current) => current.includes(title) ? current.filter((entry) => entry !== title) : [...current, title]);

  const handleAdd = () => {
    if (!item.isAvailable) return;
    const lineId = createCartLineId(item.id, selectedSize, selectedExtras);
    const existingLine = items.find((entry) => entry.id === lineId);
    if (!existingLine) {
      addItem({
        id: lineId,
        menuItemId: item.id,
        name: item.name,
        price: unitPrice,
        imageUrl: item.imageUrl,
        hpValue: item.hpValue,
        sizeLabel: selectedSize ?? undefined,
        extras: selectedExtras,
      });
      if (quantity > 1) updateQuantity(lineId, quantity);
    } else {
      updateQuantity(lineId, existingLine.quantity + quantity);
    }
    toast.success(`${item.name} added to cart`, { description: `${quantity} × ${formatPrice(unitPrice)} • +${hpTotal} HP` });
  };

  const handleFavourite = () => {
    toggleFavourite(item);
    toast(isSaved ? `${item.name} removed from saved items` : `${item.name} saved for later`, { icon: isSaved ? '💔' : '❤️' });
  };

  const optionBlocks = (
    <>
      {item.sizes?.length ? (
        <section className="space-y-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Choose size</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {item.sizes.map((size) => (
              <button
                key={size.label}
                onClick={() => setSelectedSize(size.label)}
                className={`rounded-2xl border p-4 text-left transition-colors ${selectedSize === size.label ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/30'}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display font-bold text-foreground">{size.label}</span>
                  <span className="text-sm font-semibold text-primary">{formatPrice(size.price)}</span>
                </div>
                {size.description ? <p className="mt-1 text-xs text-muted-foreground">{size.description}</p> : null}
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {item.extras?.length ? (
        <section className="space-y-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Add extras</p>
          <div className="space-y-2">
            {item.extras.map((extra) => {
              const selected = selectedExtras.includes(extra.title);
              return (
                <button
                  key={extra.title}
                  onClick={() => toggleExtra(extra.title)}
                  className={`flex w-full items-center justify-between gap-3 rounded-2xl border p-3 text-left transition-colors ${selected ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/30'}`}
                >
                  <div className="flex items-center gap-3">
                    <img src={extra.imageUrl} alt={extra.title} className="h-11 w-11 rounded-xl object-cover" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">{extra.title}</p>
                      <p className="text-xs text-muted-foreground">+{formatPrice(extra.price)}</p>
                    </div>
                  </div>
                  {selected ? <CheckCircle2 size={18} className="text-primary" /> : null}
                </button>
              );
            })}
          </div>
        </section>
      ) : null}
    </>
  );

  const summaryPanel = (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <HPBadge value={item.hpValue} variant="available" size="md" />
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.isAvailable ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
            {item.isAvailable ? 'Available now' : 'Currently unavailable'}
          </span>
        </div>
        <div className="flex items-end gap-3">
          <span className="font-display text-4xl font-extrabold text-primary">{formatPrice(unitPrice)}</span>
          {item.slashedPrice ? <span className="text-sm text-muted-foreground line-through">{formatPrice(item.slashedPrice)}</span> : null}
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
      </div>

      {optionBlocks}

      <div className="grid gap-4 rounded-3xl border border-border bg-card p-4 sm:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Quantity</p>
          <div className="mt-2 flex items-center gap-2">
            <button onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="rounded-full bg-secondary p-2" aria-label="Decrease quantity"><Minus size={16} /></button>
            <span className="w-8 text-center font-display text-xl font-bold text-foreground">{quantity}</span>
            <button onClick={() => setQuantity((value) => value + 1)} className="rounded-full bg-primary p-2 text-primary-foreground" aria-label="Increase quantity"><Plus size={16} /></button>
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Order total</p>
          <p className="mt-2 font-display text-2xl font-bold text-foreground">{formatPrice(total)}</p>
          <p className="text-xs text-accent">+{hpTotal} HP</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Delivery</p>
          <div className="mt-2 space-y-1 text-sm text-foreground">
            <p className="flex items-center gap-2"><Truck size={14} className="text-primary" /> 20–25 mins</p>
            <p className="flex items-center gap-2"><Clock size={14} className="text-primary" /> Review for +10 HP</p>
          </div>
        </div>
      </div>

      <StatusStrip compact />

      <div className="space-y-3">
        <button onClick={handleAdd} disabled={!item.isAvailable} className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-fire px-4 py-4 text-base font-bold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40">
          <ShoppingBag size={18} /> Add to cart — {formatPrice(total)}
        </button>
        <button onClick={handleFavourite} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary">
          <Heart size={16} className={isSaved ? 'fill-primary text-primary' : ''} /> {isSaved ? 'Saved item' : 'Save for later'}
        </button>
        {existingQty ? <p className="text-center text-xs text-muted-foreground">{existingQty} matching item(s) already in your cart</p> : null}
      </div>
    </div>
  );

  return (
    <main className="flex-1 pb-16 md:pt-16">
      <div className="container mx-auto max-w-6xl px-4 py-6">
        <button onClick={() => navigate(-1)} className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft size={16} /> Back to menu
        </button>

        {isDesktop ? (
          <div className="grid gap-8 lg:grid-cols-[1.05fr,0.95fr] lg:items-start">
            <div className="sticky top-24 overflow-hidden rounded-[2rem] border border-border bg-card">
              <img src={item.imageUrl} alt={item.name} className="h-[560px] w-full object-cover" />
              <div className="space-y-3 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">{item.category}</p>
                <h1 className="font-display text-4xl font-extrabold text-foreground">{item.name}</h1>
                {item.tagLine ? <p className="text-base italic text-muted-foreground">{item.tagLine}</p> : null}
              </div>
            </div>
            {summaryPanel}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="overflow-hidden rounded-[2rem] border border-border bg-card">
              <img src={item.imageUrl} alt={item.name} className="h-80 w-full object-cover" />
              <div className="space-y-3 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">{item.category}</p>
                <h1 className="font-display text-3xl font-extrabold text-foreground">{item.name}</h1>
                {item.tagLine ? <p className="text-sm italic text-muted-foreground">{item.tagLine}</p> : null}
              </div>
            </div>
            {summaryPanel}
          </div>
        )}

        <section className="mt-12 rounded-[2rem] border border-border bg-card p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Reviews</p>
              <h2 className="mt-1 font-display text-2xl font-bold text-foreground">What students are saying</h2>
            </div>
            <div className="rounded-full bg-accent/10 px-3 py-2 text-xs font-semibold text-accent">+10 HP per approved review</div>
          </div>
          {item.reviews?.length ? (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {item.reviews.map((review) => (
                <div key={review.id} className="rounded-3xl border border-border bg-background/70 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-foreground">{review.author}</p>
                      <p className="text-xs text-muted-foreground">{review.createdAt}</p>
                    </div>
                    <div className="flex items-center gap-1 text-accent">
                      {Array.from({ length: review.rating }).map((_, index) => <Star key={index} size={14} className="fill-current" />)}
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6">
              <EmptyState icon={MessageSquare} title="No reviews yet" description="Be the first to drop feedback after your order lands and earn bonus HP." />
            </div>
          )}
        </section>

        {related.length ? (
          <section className="mt-12">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold text-foreground">You might also like</h2>
              <button onClick={() => navigate('/menu')} className="text-sm font-semibold text-primary">Back to menu</button>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((entry) => (
                <FoodCard
                  key={entry.id}
                  {...entry}
                  quantityInCart={getCartQuantityForMenuItem(items, entry.id)}
                  onAddToCart={(id) => {
                    const relatedItem = MOCK_MENU.find((menuEntry) => menuEntry.id === id);
                    if (!relatedItem) return;
                    addItem({ id: relatedItem.id, menuItemId: relatedItem.id, name: relatedItem.name, price: relatedItem.price, imageUrl: relatedItem.imageUrl, hpValue: relatedItem.hpValue });
                    toast.success(`${relatedItem.name} added to cart`);
                  }}
                  onUpdateQuantity={(_, value) => updateQuantity(getPrimaryCartLineId(items, entry.id), value)}
                />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
};

export default MenuItemDetail;
