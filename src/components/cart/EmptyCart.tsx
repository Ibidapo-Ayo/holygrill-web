import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

export function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-6">
        <ShoppingBag size={32} className="text-muted-foreground" />
      </div>
      <h2 className="font-display font-bold text-foreground text-xl mb-2">Your cart is empty</h2>
      <p className="text-muted-foreground font-body text-sm mb-6 max-w-xs">
        Looks like you haven't added anything yet. Browse our menu and find something you love!
      </p>
      <Link
        to="/menu"
        className="px-6 py-3 rounded-lg bg-gradient-fire text-primary-foreground font-display font-bold text-sm hover:opacity-90 transition-opacity"
      >
        Browse Menu
      </Link>
    </div>
  );
}
