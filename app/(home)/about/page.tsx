import { Flame, HeartHandshake, ShieldCheck } from "lucide-react";

const values = [
  { title: "Campus-first", description: "Menus, delivery windows, and pricing tuned for student life.", icon: Flame },
  { title: "Reliably fast", description: "Pickup and delivery routes optimized for crowded lecture schedules.", icon: ShieldCheck },
  { title: "Community rewards", description: "Earn Holy Points on every order and unlock weekly drops.", icon: HeartHandshake },
];

export default function AboutPage() {
  return (
    <div className="container space-y-8 py-10">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">About</p>
        <h1 className="font-display text-3xl font-bold">Built for hungry students</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Holygrill was created to make great food effortless on campus—quick pickup, reliable delivery, and a rewards
          system that keeps every bite exciting.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {values.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon size={18} />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
