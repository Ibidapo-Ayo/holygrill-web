import { useState } from 'react';
import { CalendarDays, CheckCircle2, Clock, MapPin, Phone, UserRound, StickyNote } from 'lucide-react';
import { toast } from 'sonner';

const PICKUP_SLOTS = [
  '10:00 AM - 12:00 PM',
  '12:00 PM - 2:00 PM',
  '2:00 PM - 4:00 PM',
  '4:00 PM - 6:00 PM',
];

const PickupPage = () => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    riderName: '',
    pickupDate: '',
    pickupWindow: '',
    restaurantAddress: '',
    note: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    else if (!/^0[789]\d{9}$/.test(form.phone.trim())) e.phone = 'Enter a valid Nigerian phone number';
    if (!form.pickupDate.trim()) e.pickupDate = 'Pick a date';
    if (!form.pickupWindow.trim()) e.pickupWindow = 'Select a pickup window';
    if (!form.restaurantAddress.trim()) e.restaurantAddress = 'Address is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success('Pickup window saved', {
      description: `${form.pickupDate} • ${form.pickupWindow}`,
    });
    setSubmitting(false);
  };

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  return (
    <main className="flex-1 md:pt-16 pb-14">
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="container mx-auto px-4 pt-10 pb-16 md:pb-20">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-body text-primary font-medium">
              <Clock size={14} /> Pickup Window
            </div>
            <h1 className="font-display font-bold text-foreground text-3xl md:text-4xl leading-tight">
              Schedule your pickup with zero friction.
            </h1>
            <p className="text-muted-foreground font-body text-sm md:text-base max-w-2xl">
              Choose a pickup window, share your rider’s details, and we’ll have your order ready at the counter. Built to match our current experience on both desktop and mobile.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 -mt-12 md:-mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-2xl p-5 shadow-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-body uppercase tracking-wide">Pickup spot</p>
                  <p className="font-display font-bold text-foreground">Holy Grills Counter</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground font-body leading-relaxed">
                Opposite FUTA South Gate, beside Campus Mart. Please share this exact address with your rider so they can find us quickly.
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-5 shadow-card space-y-3">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-primary" />
                <p className="font-display font-bold text-foreground text-sm">Available windows</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-body">
                {PICKUP_SLOTS.map((slot) => (
                  <div
                    key={slot}
                    className="px-3 py-2 rounded-lg border border-border bg-secondary text-foreground text-center"
                  >
                    {slot}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-body">
                <CheckCircle2 size={14} className="text-success" />
                We’ll ping you 5 minutes before your window opens.
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-5 shadow-card space-y-3">
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-primary" />
                <p className="font-display font-bold text-foreground text-sm">Pickup tips</p>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground font-body">
                <li>Ensure your phone is reachable; we may call to confirm.</li>
                <li>Share your rider’s name so our team hands it off correctly.</li>
                <li>Arrive within your selected window to keep food fresh.</li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-card space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground font-body">Pickup details</p>
                  <h2 className="font-display font-bold text-foreground text-xl">Tell us who’s picking up</h2>
                </div>
                <span className="text-xs font-body text-muted-foreground bg-secondary px-3 py-1.5 rounded-full">
                  Desktop & mobile friendly
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    key: 'name',
                    label: 'Your Name',
                    placeholder: 'e.g. Ada Lovelace',
                    icon: UserRound,
                  },
                  {
                    key: 'phone',
                    label: 'Phone Number',
                    placeholder: '08012345678',
                    icon: Phone,
                  },
                  {
                    key: 'riderName',
                    label: "Rider's Name (optional)",
                    placeholder: 'Who is picking up?',
                    icon: UserRound,
                  },
                  {
                    key: 'pickupDate',
                    label: 'Pickup Date',
                    placeholder: 'Select a date',
                    icon: CalendarDays,
                    type: 'date',
                  },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="flex items-center gap-2 text-xs text-muted-foreground font-body mb-1">
                      <field.icon size={14} className="text-primary" />
                      {field.label}
                    </label>
                    <input
                      type={field.type || 'text'}
                      value={form[field.key as keyof typeof form]}
                      onChange={(e) => handleChange(field.key as keyof typeof form, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    {errors[field.key] && <p className="text-destructive text-xs font-body mt-1">{errors[field.key]}</p>}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-xs text-muted-foreground font-body mb-1">
                    <Clock size={14} className="text-primary" />
                    Pickup Window
                  </label>
                  <select
                    value={form.pickupWindow}
                    onChange={(e) => handleChange('pickupWindow', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">Select a window</option>
                    {PICKUP_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                  {errors.pickupWindow && <p className="text-destructive text-xs font-body mt-1">{errors.pickupWindow}</p>}
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs text-muted-foreground font-body mb-1">
                    <MapPin size={14} className="text-primary" />
                    Restaurant Address
                  </label>
                  <input
                    type="text"
                    value={form.restaurantAddress}
                    onChange={(e) => handleChange('restaurantAddress', e.target.value)}
                    placeholder="Opposite FUTA South Gate..."
                    className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  {errors.restaurantAddress && <p className="text-destructive text-xs font-body mt-1">{errors.restaurantAddress}</p>}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs text-muted-foreground font-body mb-1">
                  <StickyNote size={14} className="text-primary" />
                  Notes (optional)
                </label>
                <textarea
                  value={form.note}
                  onChange={(e) => handleChange('note', e.target.value)}
                  placeholder="Anything we should know? e.g. rider will call on arrival."
                  className="w-full min-h-[110px] px-3 py-3 rounded-lg bg-secondary border border-border text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 justify-between">
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-body">
                  <CheckCircle2 size={14} className="text-success" />
                  We’ll prep your order to hit the window you select.
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-primary text-primary-foreground font-display font-bold text-sm hover:bg-primary-hover transition-colors disabled:opacity-60"
                >
                  {submitting ? 'Saving...' : 'Save Pickup Window'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PickupPage;
