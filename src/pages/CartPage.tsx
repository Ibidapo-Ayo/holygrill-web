import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartItemCard } from '@/components/cart/CartItemCard';
import { CartSummary } from '@/components/cart/CartSummary';
import { EmptyCart } from '@/components/cart/EmptyCart';
import { useCartStore, selectSubtotal, selectTotalHP } from '@/stores/cartStore';
import { DELIVERY_FEE } from '@/data/menu';

const CartPage = () => {
  const { items, updateQuantity, removeItem } = useCartStore();
  const subtotal = useCartStore(selectSubtotal);
  const totalHP = useCartStore(selectTotalHP);
  const navigate = useNavigate();

  const total = subtotal + (items.length > 0 ? DELIVERY_FEE : 0);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="font-display font-bold text-foreground text-2xl md:text-3xl mb-8">Your Cart</h1>

          {items.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-3">
                {items.map((item) => (
                  <CartItemCard
                    key={item.id}
                    {...item}
                    onIncrement={() => updateQuantity(item.id, item.quantity + 1)}
                    onDecrement={() => updateQuantity(item.id, item.quantity - 1)}
                    onRemove={() => removeItem(item.id)}
                  />
                ))}
              </div>
              <CartSummary
                subtotal={subtotal}
                deliveryFee={DELIVERY_FEE}
                total={total}
                hpToEarn={totalHP}
                onCheckout={() => navigate('/checkout')}
              />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CartPage;
