import { Link } from 'react-router-dom';
import { Flame } from 'lucide-react';

export function Footer() {
  return (
    <footer className="hidden md:block border-t border-border bg-card mt-auto">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Flame size={20} className="text-primary" />
              <span className="font-display font-bold text-foreground">Holy Grills</span>
            </div>
            <p className="text-xs text-muted-foreground font-body leading-relaxed">
              The student participation engine. Every meal is a step towards something greater.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-foreground text-sm mb-3">Quick Links</h4>
            <div className="space-y-2">
              {[{ to: '/menu', label: 'Menu' }, { to: '/cart', label: 'Cart' }, { to: '/dashboard', label: 'Dashboard' }].map((link) => (
                <Link key={link.to} to={link.to} className="block text-xs text-muted-foreground font-body hover:text-foreground transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display font-bold text-foreground text-sm mb-3">Support</h4>
            <div className="space-y-2 text-xs text-muted-foreground font-body">
              <p>help@holygrills.com</p>
              <p>FUTA Campus, Akure</p>
            </div>
          </div>

          {/* HP */}
          <div>
            <h4 className="font-display font-bold text-foreground text-sm mb-3">Holy Points</h4>
            <p className="text-xs text-muted-foreground font-body leading-relaxed">
              Earn HP with every order. Climb the leaderboard and unlock exclusive rewards.
            </p>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center">
          <p className="text-xs text-muted-foreground font-body">
            © {new Date().getFullYear()} Holy Grills. Faith · Love · Energy · Flavor
          </p>
        </div>
      </div>
    </footer>
  );
}
