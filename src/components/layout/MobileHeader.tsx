import { Link, useLocation } from '@/lib/router';
import { Bell } from 'lucide-react';
import { MobileSidebar } from './MobileSidebar';

interface MobileHeaderProps {
  title?: string;
  showBack?: boolean;
}

export function MobileHeader({ title }: MobileHeaderProps) {
  const location = useLocation();
  if (location.pathname.startsWith('/admin')) return null;

  return (
    <header className="md:hidden sticky top-0 z-40 bg-background/90 backdrop-blur-xl border-b border-border">
      <div className="flex items-center justify-between px-4 h-14">
        <Link to="/" className="flex items-center">
          <img src="/logo.png" alt="Holy Grills" className="h-8 w-auto" />
        </Link>
        {/* {title && <h1 className="text-base font-extrabold text-foreground truncate">{title}</h1>} */}
        <div className="flex items-center gap-2">
          <button className="relative p-2 text-brand-brown/70 rounded-full hover:bg-secondary">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
          </button>
          <MobileSidebar />
        </div>
      </div>
    </header>
  );
}
