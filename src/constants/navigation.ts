export const DESKTOP_NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/menu', label: 'Menu' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/orders', label: 'My Orders' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/rewards', label: 'Rewards' },
] as const;

export const MOBILE_TAB_LINKS = [
  { to: '/', label: 'Home', icon: 'home' },
  { to: '/menu', label: 'Menu', icon: 'menu' },
  { to: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { to: '/orders', label: 'Orders', icon: 'orders' },
  { to: '/cart', label: 'Cart', icon: 'cart' },
] as const;

export const DASHBOARD_SIDEBAR_LINKS = [
  { to: '/dashboard', label: 'My HP' },
  { to: '/orders', label: 'My Orders' },
  { to: '/referrals', label: 'Referrals' },
  { to: '/dashboard#notifications', label: 'Notifications' },
  { to: '/profile', label: 'Profile Settings' },
] as const;
