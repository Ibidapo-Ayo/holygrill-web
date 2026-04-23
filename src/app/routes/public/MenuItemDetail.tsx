import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, Flame, ShoppingBag, Heart } from 'lucide-react';
import { MOCK_MENU, formatPrice } from '@/data/menu';
import { useCartStore } from '@/stores/cartStore';
import { FoodCard } from '@/components/menu/FoodCard';
import { HPBadge } from '@/components/hp/HPBadge';
import { toast } from 'sonner';

const MenuItemDetail = () => {
  const { menuId } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const { items, addItem, updateQuantity } = useCartStore();

  const item = useMemo(() => MOCK_MENU.find((m) => m.id === menuId), [menuId]);
  const related = useMemo(() => {
    if (!item) return [];
    return MOCK_MENU.filter((m) => m.category === item.category && m.id !== item.id).slice(0, 3);
  }, [item]);

  if (!item) {
    return (
      <main className="flex-1 md:pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-3xl text-center space-y-4">
          <p className="text-lg font-display font-bold text-foreground">Item not found</p>
          <p className="text-sm text-muted-foreground font-body">The menu item you’re looking for doesn’t exist.</p>
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
  const total = item.price * quantity;
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

  return (
    <main className="flex-1 md:pt-16 pb-12">
      <div className="relative w-full overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="container mx-auto px-4 max-w-5xl">
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
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="relative rounded-3xl overflow-hidden border border-border bg-card shadow-card">
            <div className="relative h-80 md:h-[420px]">
              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            </div>
            <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-8">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground font-body uppercase tracking-wide">{item.category}</p>
                    <h1 className="font-display font-bold text-foreground text-2xl md:text-3xl leading-tight mt-1">
                      {item.name}
                    </h1>
                  </div>
                  <button className="hidden md:inline-flex items-center justify-center w-10 h-10 rounded-full border border-border text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                    <Heart size={16} />
                  </button>
                </div>
                <p className="text-sm md:text-base text-muted-foreground font-body leading-relaxed">{item.description}</p>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="px-3 py-1.5 rounded-lg bg-secondary text-foreground text-sm font-display font-bold">
                    {formatPrice(item.price)}
                  </div>
                  <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-xs font-body">
                    <Flame size={14} /> Earn {item.hpValue} HP each
                  </div>
                  {item.isAvailable ? (
                    <span className="text-xs font-body text-success bg-success/10 px-3 py-1 rounded-full">Available</span>
                  ) : (
                    <span className="text-xs font-body text-destructive bg-destructive/10 px-3 py-1 rounded-full">Unavailable</span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl border border-border bg-card/70">
                    <p className="text-xs text-muted-foreground font-body mb-2">Quantity</p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-10 h-10 rounded-lg bg-secondary border border-border flex items-center justify-center hover:bg-border transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="text-lg font-display font-bold min-w-[2ch] text-center">{quantity}</span>
                      <button
                        onClick={() => setQuantity((q) => q + 1)}
                        className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary-hover transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl border border-border bg-card/70">
                    <p className="text-xs text-muted-foreground font-body mb-1">Total</p>
                    <p className="text-xl font-display font-bold text-foreground">{formatPrice(total)}</p>
                    <p className="text-[11px] text-muted-foreground font-body">Includes +{hpTotal} HP</p>
                  </div>
                  <div className="p-4 rounded-xl border border-border bg-card/70">
                    <p className="text-xs text-muted-foreground font-body mb-1">Delivery Speed</p>
                    <p className="text-sm font-body text-foreground">~20-25 mins to campus</p>
                    <p className="text-[11px] text-muted-foreground font-body">Peak hours may vary</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
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
