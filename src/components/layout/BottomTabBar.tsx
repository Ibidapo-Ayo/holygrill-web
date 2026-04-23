import { NavLink, useLocation } from '@/lib/router';
import { motion } from 'framer-motion';
import { UtensilsCrossed, House, ShoppingCart, Gift, Clock3 } from 'lucide-react';
import { useCartStore, selectItemCount } from '@/stores/cartStore';

const TABS = [
  { to: '/', label: 'Home', Icon: House },
  { to: '/menu', label: 'Menu', Icon: UtensilsCrossed },
  { to: '/dashboard', label: 'My Orders', Icon: Clock3 },
  { to: '/rewards', label: 'Rewards', Icon: Gift },
  { to: '/cart', label: 'Cart', Icon: ShoppingCart, badgeKey: 'cart' as const },
];

export function BottomTabBar() {
  const location = useLocation();
  const cartCount = useCartStore(selectItemCount);

  // Hide on admin routes
  if (location.pathname.startsWith('/admin')) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 pb-safe pointer-events-none">
      <div className="px-3 pb-3 pointer-events-auto">
        <nav
          className="mx-auto max-w-md bg-card/95 backdrop-blur-xl border border-border rounded-3xl shadow-tab"
          aria-label="Primary"
        >
          <ul className="grid grid-cols-5 px-2 py-2">
            {TABS.map(({ to, label, Icon, badgeKey }) => (
              <li key={to} className="flex">
                <NavLink to={to} end={to === '/'} className="flex-1">
                  {({ isActive }) => (
                    <div className="relative flex flex-col items-center justify-center gap-1 py-1.5 px-1">
                      {isActive && (
                        <motion.div
                          layoutId="tab-pill"
                          className="absolute inset-0 rounded-2xl bg-primary/10"
                          transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                        />
                      )}
                      <div className="relative">
                        <Icon
                            className={`w-6 h-6 transition-colors ${isActive ? 'text-primary' : 'text-brand-brown/60'}`}
                            strokeWidth={isActive ? 2.6 : 2.2}
                          />

                        {badgeKey === 'cart' && cartCount > 0 && (
                          <span className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                            {cartCount}
                          </span>
                        )}
                      </div>
                      <span
                        className={`relative text-[10px] font-semibold transition-colors ${
                          isActive ? 'text-primary' : 'text-brand-brown/70'
                        }`}
                      >
                        {label}
                      </span>
                    </div>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
