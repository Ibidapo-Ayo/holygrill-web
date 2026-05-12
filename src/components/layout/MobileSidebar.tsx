import { useState } from 'react';
import { Link } from '@/lib/router';
import { Dialog, DialogContent, DialogOverlay, DialogTrigger } from '@/components/ui/dialog';
import { Menu, ChevronRight } from 'lucide-react';

const LINKS = [
  { label: 'Leaderboard', to: '/leaderboard' },
  { label: 'Events & Catering', to: '/events' },
  { label: 'Wallet', to: '/wallet' },
  { label: 'Referrals', to: '/referrals' },
  { label: 'Marketplace', to: '/marketplace' },
  { label: 'Learn about HP', to: '/hp' },
];

export function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="relative rounded-full p-2 text-brand-brown/70 hover:bg-secondary md:hidden">
          <Menu size={20} />
        </button>
      </DialogTrigger>
      <DialogOverlay />
      <DialogContent className="bottom-0 left-auto right-0 top-0 w-full max-w-[300px] translate-x-0 translate-y-0 rounded-none border-l bg-[#FFFAEF] p-0 shadow-2xl data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-right-full md:hidden">
        <div className="border-b border-border px-5 py-4">
          <p className="font-display font-bold text-foreground">Explore Holy Grills</p>
        </div>
        <nav className="space-y-2 p-5">
          {LINKS.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              onClick={() => setOpen(false)}
              className="flex w-full items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground"
            >
              {item.label}
              <ChevronRight size={16} className="text-muted-foreground" />
            </Link>
          ))}
        </nav>
      </DialogContent>
    </Dialog>
  );
}
