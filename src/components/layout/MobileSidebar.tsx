import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogOverlay, DialogTrigger } from '@/components/ui/dialog';
import { Menu, X, ChevronRight } from 'lucide-react';

const LINKS = [
  { label: 'About HG', to: '/' },
  { label: 'Terms of Service', to: '/' },
  { label: 'Your Trust', to: '/' },
  { label: 'Contact Us', to: '/' },
];

export function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="md:hidden relative p-2 rounded-full hover:bg-secondary text-brand-brown/70">
          <Menu size={20} />
        </button>
      </DialogTrigger>
      <DialogOverlay className="md:hidden" />
      <DialogContent
        className="md:hidden right-0 left-auto top-0 bottom-0 translate-x-0 translate-y-0 max-w-[82%] w-full rounded-none border-l
                   data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right
                   p-0 shadow-2xl"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
          <p className="font-display font-bold text-foreground">Menu</p>
          <button onClick={() => setOpen(false)} className="p-2 rounded-full hover:bg-secondary text-muted-foreground">
            <X size={18} />
          </button>
        </div>
        <nav className="p-4 space-y-2">
          {LINKS.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              onClick={() => setOpen(false)}
              className="w-full inline-flex items-center justify-between px-3 py-3 rounded-lg bg-secondary hover:bg-border text-foreground font-display font-semibold text-sm"
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
