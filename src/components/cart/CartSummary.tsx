import { formatPrice } from '@/data/menu';
import { Flame } from 'lucide-react';

interface CartSummaryProps {
  subtotal: number;
  deliveryFee: number;
  total: number;
  hpToEarn: number;
  onCheckout: () => void;
  isCheckoutDisabled?: boolean;
}

export function CartSummary({ subtotal, deliveryFee, total, hpToEarn, onCheckout, isCheckoutDisabled }: CartSummaryProps) {
  return (
    <div className="bg-card rounded-lg border border-border p-5 space-y-4 sticky top-24">
      <h3 className="font-display font-bold text-foreground text-lg">Order Summary</h3>

      <div className="space-y-2 text-sm font-body">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal</span>
          <span className="text-foreground">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Delivery Fee</span>
          <span className="text-foreground">{formatPrice(deliveryFee)}</span>
        </div>
        <div className="border-t border-border pt-2 flex justify-between font-bold text-foreground text-base">
          <span>Total</span>
          <span className="text-primary">{formatPrice(total)}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-accent/10 rounded-md px-3 py-2">
        <Flame size={16} className="text-accent" />
        <span className="text-xs font-body text-accent font-medium">You'll earn +{hpToEarn} HP with this order!</span>
      </div>

      <button
        onClick={onCheckout}
        disabled={isCheckoutDisabled}
        className="w-full py-3 rounded-lg bg-gradient-fire text-primary-foreground font-display font-bold text-base hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Checkout — {formatPrice(total)}
      </button>
    </div>
  );
}
