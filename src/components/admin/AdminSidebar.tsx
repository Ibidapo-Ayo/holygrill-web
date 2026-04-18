import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, ShoppingBag, UtensilsCrossed, Users, 
  Flame, Settings, LogOut, ChevronLeft, ChevronRight, BarChart3,
  CreditCard, MessageSquare
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_SECTIONS = [
  {
    label: 'Overview',
    items: [
      { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    ],
  },
  {
    label: 'Operations',
    items: [
      { to: '/admin/orders', label: 'Orders', icon: ShoppingBag, badge: 4 },
      { to: '/admin/payments', label: 'Payments', icon: CreditCard },
      { to: '/admin/menu', label: 'Menu Items', icon: UtensilsCrossed },
    ],
  },
  {
    label: 'People',
    items: [
      { to: '/admin/users', label: 'Users & HP', icon: Users },
      { to: '/admin/support', label: 'Support', icon: MessageSquare, badge: 2 },
    ],
  },
  {
    label: 'System',
    items: [
      { to: '/admin/settings', label: 'Settings', icon: Settings },
    ],
  },
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
          <div className="w-8 h-8 rounded-lg bg-gradient-fire flex items-center justify-center shrink-0">
            <Flame size={18} className="text-primary-foreground" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden"
              >
                <span className="font-display font-bold text-foreground text-sm whitespace-nowrap block">Holy Grills</span>
                <span className="text-[9px] text-muted-foreground font-body whitespace-nowrap block">Admin Console</span>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Nav sections */}
      <nav className="flex-1 py-3 px-2 overflow-y-auto scrollbar-hide">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="mb-3">
            <AnimatePresence>
              {!collapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-3 py-1 text-[9px] font-body font-semibold text-muted-foreground/60 uppercase tracking-widest"
                >
                  {section.label}
                </motion.p>
              )}
            </AnimatePresence>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg font-body text-[13px] font-medium transition-all relative ${
                      active
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    } ${collapsed ? 'justify-center' : ''}`}
                    title={collapsed ? item.label : undefined}
                  >
                    <item.icon size={16} className="shrink-0" />
                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex-1 whitespace-nowrap"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {'badge' in item && item.badge && item.badge > 0 && (
                      <span className={`w-4 h-4 rounded-full bg-primary text-primary-foreground text-[8px] font-bold flex items-center justify-center ${collapsed ? 'absolute -top-0.5 -right-0.5' : ''}`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t border-border p-2 space-y-0.5">
        <Link
          to="/"
          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg font-body text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Back to Store' : undefined}
        >
          <LogOut size={16} className="shrink-0" />
          {!collapsed && <span>Back to Store</span>}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-body text-[13px] text-muted-foreground hover:text-foreground hover:bg-secondary transition-all ${collapsed ? 'justify-center' : ''}`}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
