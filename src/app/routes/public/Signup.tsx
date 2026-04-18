import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Mail, Lock, User, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const SignupPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    if (form.password.length < 6) e.password = 'Min 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords don\'t match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    toast.success('Account created! Welcome to Holy Grills 🔥');
  };

  const fields = [
    { key: 'name', label: 'Full Name', icon: User, type: 'text', placeholder: 'John Doe' },
    { key: 'email', label: 'Email', icon: Mail, type: 'email', placeholder: 'you@futa.edu.ng' },
    { key: 'password', label: 'Password', icon: Lock, type: 'password', placeholder: '••••••••' },
    { key: 'confirmPassword', label: 'Confirm Password', icon: Lock, type: 'password', placeholder: '••••••••' },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Flame size={28} className="text-primary" />
            <span className="font-display font-bold text-2xl text-foreground">Holy Grills</span>
          </div>
          <p className="text-muted-foreground font-body text-sm">Create your account and start earning HP</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="block text-xs text-muted-foreground font-body mb-1">{f.label}</label>
              <div className="relative">
                <f.icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={f.type}
                  value={form[f.key as keyof typeof form]}
                  onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              {errors[f.key] && <p className="text-destructive text-xs font-body mt-1">{errors[f.key]}</p>}
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-fire text-primary-foreground font-display font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 size={16} className="animate-spin" /> Creating account...</> : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground font-body mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-medium hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
