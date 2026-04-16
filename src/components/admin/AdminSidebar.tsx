import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, ShoppingBag, UtensilsCrossed, Users, 
  Flame, Settings, LogOut, ChevronLeft, ChevronRight, BarChart3
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/menu', label: 'Menu Items', icon: UtensilsCrossed },
  { to: '/admin/users', label: 'Users & HP', icon: Users },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminSidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <aside className={`fixed left-0 top-0 bottom-0 z-40 flex flex-col bg-card border-r border-border transition-all duration-300 ${collapsed ? 'w-16' : 'w-60'}`}>
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-border shrink-0">
        <Link to="/admin" className="flex items-center gap-2 overflow-hidden">
          <Flame size={24} className="text-primary shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="font-display font-bold text-foreground text-base whitespace-nowrap"
              >
                Holy Grills
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-body text-sm font-medium transition-all ${
                active
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              } ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon size={18} className="shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-border p-2 space-y-1">
        <Link
          to="/"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-body text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Back to Store' : undefined}
        >
          <LogOut size={18} className="shrink-0" />
          {!collapsed && <span>Back to Store</span>}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-body text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-all ${collapsed ? 'justify-center' : ''}`}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
