import { Minus, Plus, Trash2 } from 'lucide-react';
import { formatPrice } from '@/data/menu';
import type { CartItem as CartItemType } from '@/types';

interface CartItemProps extends CartItemType {
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}

export function CartItemCard({ name, price, quantity, imageUrl, onIncrement, onDecrement, onRemove }: CartItemProps) {
  return (
    <div className="flex gap-4 p-4 bg-card rounded-lg border border-border">
      <img src={imageUrl} alt={name} className="w-20 h-20 rounded-md object-cover shrink-0" />
      <div className="flex-1 min-w-0">
        <h4 className="font-display font-bold text-foreground text-sm truncate">{name}</h4>
        <p className="text-primary font-bold font-body text-sm mt-1">{formatPrice(price * quantity)}</p>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <button onClick={onDecrement} className="w-7 h-7 rounded-md bg-secondary flex items-center justify-center text-foreground hover:bg-border transition-colors">
              <Minus size={14} />
            </button>
            <span className="text-sm font-bold font-body w-5 text-center text-foreground">{quantity}</span>
            <button onClick={onIncrement} className="w-7 h-7 rounded-md bg-primary flex items-center justify-center text-primary-foreground hover:bg-primary-hover transition-colors">
              <Plus size={14} />
            </button>
          </div>
          <button onClick={onRemove} className="text-muted-foreground hover:text-destructive transition-colors">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
