import { useState } from 'react';
import { useNavigate } from '@/lib/router';
import { User, Mail, Camera, Loader2, ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore, getInitials, safeImageUrl } from '@/stores/authStore';

const UserProfilePage = () => {
  const { user, setUser, hasHydrated } = useAuthStore();
  const navigate = useNavigate();

  const [name, setName] = useState(user.full_name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [avatarUrl, setAvatarUrl] = useState(user?.photo_url ?? '');
  const [saving, setSaving] = useState(false);

  /** Only allow http/https URLs to avoid javascript: URI injection. */
  const safeAvatarUrl = safeImageUrl(avatarUrl);

  if (!hasHydrated || !user) {
    return null;
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name cannot be empty.');
      return;
    }
    setSaving(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 800));
    setUser({
      ...user,
      email: email.trim(),
      full_name: name.trim(),
      photo_url: avatarUrl.trim() || null,
    });
    toast.success('Profile updated!');
    setSaving(false);
  };

  const initials = getInitials(name || user.full_name);

  return (
    <main className="flex-1 md:pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-lg">
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm font-body mb-6 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </button>

        <h1 className="font-display font-bold text-foreground text-2xl mb-6">Edit Profile</h1>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative w-24 h-24">
              {safeAvatarUrl ? (
                <img
                  src={safeAvatarUrl}
                  alt={name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-primary"
                  onError={() => setAvatarUrl('')}
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-fire flex items-center justify-center text-primary-foreground text-3xl font-bold border-4 border-primary">
                  {initials}
                </div>
              )}
              <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center border-2 border-background">
                <Camera size={14} className="text-primary-foreground" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground font-body text-center">Enter an image URL below to update your photo</p>
          </div>

          {/* Avatar URL */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground font-display">Profile Image URL</label>
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://example.com/photo.jpg"
              className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground font-display">Full Name</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-secondary border border-border text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground font-display">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-secondary border border-border text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 rounded-lg bg-gradient-fire text-primary-foreground font-display font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? (
              <><Loader2 size={16} className="animate-spin" /> Saving...</>
            ) : (
              <><Save size={16} /> Save Changes</>
            )}
          </button>
        </form>
      </div>
    </main>
  );
};

export default UserProfilePage;
