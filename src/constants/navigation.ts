export const DESKTOP_NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/menu', label: 'Menu' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/events', label: 'Events' },
  { to: '/rewards', label: 'Rewards' },
  { to: '/orders', label: 'My Orders' },
] as const;

export const MOBILE_TAB_LINKS = [
  { to: '/', label: 'Home', icon: 'home' },
  { to: '/menu', label: 'Menu', icon: 'menu' },
  { to: '/rewards', label: 'Rewards', icon: 'rewards' },
  { to: '/cart', label: 'Cart', icon: 'cart' },
] as const;

export const DASHBOARD_SIDEBAR_LINKS = [
  { to: '/dashboard', label: 'My HP' },
  { to: '/orders', label: 'My Orders' },
  { to: '/wallet', label: 'Wallet' },
  { to: '/referrals', label: 'Referrals' },
  { to: '/dashboard#notifications', label: 'Notifications' },
  { to: '/dashboard#profile', label: 'Profile Settings' },
] as const;
