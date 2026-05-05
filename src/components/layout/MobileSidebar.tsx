import { useState } from "react";
import { Link, useNavigate } from "@/lib/router";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Menu, ChevronRight, LogOut, User } from "lucide-react";
import { useAuthStore, getInitials } from "@/stores/authStore";

const LINKS = [
  { label: "About HG", to: "/about" },
  { label: "Terms of Service", to: "/terms" },
  { label: "Your Trust", to: "/trust" },
  { label: "Contact Us", to: "/contact" },
];

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="md:hidden relative p-2 rounded-full hover:bg-secondary text-brand-brown/70">
          <Menu size={20} />
        </button>
      </DialogTrigger>
      <DialogOverlay className="" />
      <DialogContent
        className="md:hidden right-0 left-auto top-0 bottom-0 translate-x-0 translate-y-0 max-w-[270px] w-full rounded-none border-l
                   data-[state=open]:slide-in-from-right-full data-[state=closed]:slide-out-to-right-full
                   p-0 shadow-2xl bg-[#FFFAEF]"
      >
        <div className="flex px-5 py-3">
          <p className="font-display font-bold text-foreground">Menu</p>
        </div>

        {isAuthenticated && user ? (
          <div className="px-5 pb-4 border-b border-border">
            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3"
            >
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-primary"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-fire flex items-center justify-center text-primary-foreground text-sm font-bold">
                  {getInitials(user.name)}
                </div>
              )}
              <div className="min-w-0">
                <p className="font-bold text-foreground text-sm truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </Link>
          </div>
        ) : null}

        <nav className="p-5 space-y-5">
          {!isAuthenticated && (
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="w-full inline-flex items-center justify-between px-3 py-2 text-primary text-md border-b-[#DCC9A3] border-b-2 font-sans font-bold"
            >
              <span className="flex items-center gap-2"><User size={16} /> Login</span>
              <ChevronRight size={16} className="text-muted-foreground" />
            </Link>
          )}
          {LINKS.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              onClick={() => setOpen(false)}
              className="w-full inline-flex items-center justify-between px-3 py-2 text-[#341100] text-md border-b-[#DCC9A3] border-b-2 font-sans font-bold"
            >
              {item.label}
              <ChevronRight size={16} className="text-muted-foreground" />
            </Link>
          ))}
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="w-full inline-flex items-center gap-2 px-3 py-2 text-destructive text-md font-sans font-bold"
            >
              <LogOut size={16} /> Logout
            </button>
          )}
        </nav>
      </DialogContent>
    </Dialog>
  );
}
