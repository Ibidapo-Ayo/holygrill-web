import { useState } from 'react';
import { Link, useLocation } from '@/lib/router';
import { ShoppingCart, Menu, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore, selectItemCount } from '@/stores/cartStore';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/menu', label: 'Menu' },
  { to: '/rewards', label: 'Rewards' },
  { to: '/dashboard', label: 'My Orders' },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const itemCount = useCartStore(selectItemCount);

  return (
    <nav className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-background/85 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Holy Grills" className="h-9 w-auto" />
        </Link>

        <div className="flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-semibold transition-colors ${
                location.pathname === link.to ? 'text-primary' : 'text-brand-brown/70 hover:text-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link to="/cart" className="relative p-2 text-brand-brown/70 hover:text-foreground transition-colors">
            <ShoppingCart size={20} />
            {itemCount > 0 && (
              <motion.span
                key={itemCount}
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center"
              >
                {itemCount}
              </motion.span>
            )}
          </Link>

          <Link to="/login" className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-cta text-primary-foreground text-sm font-bold shadow-glow hover:opacity-95 transition-opacity">
            <User size={16} />
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
