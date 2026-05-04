import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, Trash2, UtensilsCrossed } from 'lucide-react';
import { useNavigate } from '@/lib/router';
import { useFavouritesStore } from '@/stores/favouritesStore';
import { useCartStore } from '@/stores/cartStore';
import { formatPrice } from '@/data/menu';
import { HPBadge } from '@/components/hp/HPBadge';
import { toast } from 'sonner';

const FavouritesPage = () => {
  const navigate = useNavigate();
  const { items, toggle } = useFavouritesStore();
  const { addItem } = useCartStore();

  const handleAddToCart = (item: (typeof items)[number]) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      imageUrl: item.imageUrl,
      hpValue: item.hpValue,
    });
    toast.success(`${item.name} added to cart 🔥`, {
      description: `${formatPrice(item.price)} · +${item.hpValue} HP`,
    });
  };

  return (
    <main className="flex-1 md:pt-16 pb-24 md:pb-16">
      {/* ── Page header ── */}
      <div className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-14 md:top-16 z-20">
        <div className="container mx-auto px-4 py-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
            <Heart size={18} className="text-primary fill-primary" />
          </div>
          <div>
            <h1 className="font-display font-extrabold text-foreground text-xl leading-tight">
              My Favourites
            </h1>
            <p className="text-xs text-muted-foreground font-body">
              {items.length === 0
                ? 'No saved items yet'
                : `${items.length} saved item${items.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* ── Empty state ── */}
        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-primary/5 flex items-center justify-center">
                <UtensilsCrossed size={40} className="text-primary/30" />
              </div>
              <div className="absolute -top-1 -right-1 w-9 h-9 rounded-full bg-background border-2 border-border flex items-center justify-center">
                <Heart size={16} className="text-muted-foreground/40" />
              </div>
            </div>
            <div className="space-y-1.5">
              <p className="font-display font-bold text-foreground text-lg">
                Nothing saved yet
              </p>
              <p className="text-sm text-muted-foreground font-body max-w-xs">
                Tap the heart on any dish to save it here for quick ordering later.
              </p>
            </div>
            <button
              onClick={() => navigate('/menu')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-display font-bold text-sm hover:bg-primary-hover transition-colors"
            >
              <UtensilsCrossed size={15} />
              Browse Menu
            </button>
          </div>
        )}

        {/* ── Grid ── */}
        <AnimatePresence mode="popLayout">
          {items.length > 0 && (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            >
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.88 }}
                  transition={{ duration: 0.22 }}
                  className="group relative rounded-2xl overflow-hidden bg-card border border-border shadow-card flex flex-col"
                >
                  {/* Image */}
                  <button
                    onClick={() => navigate(`/menu/${item.id}`)}
                    className="relative aspect-[4/3] overflow-hidden block w-full"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    {/* HP badge */}
                    <div className="absolute top-2.5 left-2.5">
                      <HPBadge value={item.hpValue} variant="available" />
                    </div>
                    {/* Category pill */}
                    <div className="absolute bottom-2.5 left-2.5">
                      <span className="text-[10px] font-body font-semibold text-white/80 bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full uppercase tracking-wide">
                        {item.category}
                      </span>
                    </div>
                  </button>

                  {/* Body */}
                  <div className="p-4 flex flex-col gap-3 flex-1">
                    <div className="flex-1">
                      <button
                        onClick={() => navigate(`/menu/${item.id}`)}
                        className="block text-left w-full"
                      >
                        <h3 className="font-display font-bold text-foreground text-base leading-tight hover:text-primary transition-colors line-clamp-1">
                          {item.name}
                        </h3>
                      </button>
                      {item.tagLine && (
                        <p className="text-xs text-muted-foreground font-body italic mt-0.5 line-clamp-1">
                          {item.tagLine}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground font-body mt-1.5 line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    {/* Price row */}
                    <div className="flex items-center gap-2">
                      <span className="font-display font-extrabold text-primary text-lg">
                        {formatPrice(item.price)}
                      </span>
                      {item.slashedPrice && (
                        <span className="text-xs text-muted-foreground line-through font-body">
                          {formatPrice(item.slashedPrice)}
                        </span>
                      )}
                      {item.percentageOff && (
                        <span className="text-[10px] font-bold bg-success/15 text-success px-1.5 py-0.5 rounded-full ml-auto">
                          {item.percentageOff}% off
                        </span>
                      )}
                    </div>

                    {/* Action row */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAddToCart(item)}
                        disabled={!item.isAvailable}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary text-primary-foreground font-display font-bold text-xs hover:bg-primary-hover transition-colors disabled:opacity-50"
                      >
                        <ShoppingBag size={13} />
                        {item.isAvailable ? 'Add to Cart' : 'Unavailable'}
                      </button>
                      <button
                        onClick={() => {
                          toggle(item);
                          toast(`${item.name} removed from favourites`, { icon: '💔' });
                        }}
                        aria-label="Remove from favourites"
                        className="w-10 h-10 rounded-xl border border-border bg-secondary flex items-center justify-center text-destructive/70 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
};

export default FavouritesPage;
