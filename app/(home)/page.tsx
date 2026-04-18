import Image from "next/image";
import Link from "next/link";
import { Flame, MapPin, ShoppingBag, Sparkles, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

const menuPreview = [
  {
    name: "Holy Combo",
    description: "Double-stacked grilled beef with spicy suya aioli.",
    price: "₦4,800",
  },
  {
    name: "Fire-Grilled Wings",
    description: "Smoky wings with palm honey glaze and sesame crunch.",
    price: "₦3,200",
  },
  {
    name: "Campus Shawarma",
    description: "Loaded shawarma with charred peppers and extra HP.",
    price: "₦2,900",
  },
];

const stats = [
  { label: "Orders delivered", value: "10K+", icon: ShoppingBag },
  { label: "Happy students", value: "2.5K+", icon: Sparkles },
  { label: "Holy points earned", value: "50K+", icon: Trophy },
];

export default function HomePage() {
  return (
    <div className="with-tabbar bg-background text-foreground md:pb-0">
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="container grid gap-10 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Flame size={14} /> FUTA&apos;s #1 grill experience
            </div>
            <h1 className="font-display text-4xl leading-tight tracking-tight md:text-5xl lg:text-6xl">
              Every meal, every point, every moment.
            </h1>
            <p className="max-w-xl text-base text-muted-foreground md:text-lg">
              Holygrill keeps campus fed with fresh grills, fast delivery, and Holy Points that reward every bite.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/menu">Order now</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/about">Learn more</Link>
              </Button>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <MapPin size={16} /> Akure campus delivery & pickup
              </span>
              <span className="inline-flex items-center gap-2">
                <Flame size={16} /> Earn Holy Points on every order
              </span>
            </div>
          </div>
          <div className="relative h-[320px] rounded-3xl border border-border/60 bg-card shadow-card md:h-[420px]">
            <Image
              src="/images/hero-burger.jpg"
              alt="Holygrill hero burger"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="rounded-3xl object-cover"
              priority
            />
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-background/70 via-background/20 to-transparent" />
          </div>
        </div>
      </section>

      <section className="border-b border-border/60 bg-card/40">
        <div className="container grid gap-6 py-10 md:grid-cols-3">
          {stats.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-5 shadow-card"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <item.icon size={20} />
              </span>
              <div>
                <p className="text-lg font-semibold">{item.value}</p>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container space-y-8 py-14">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Menu preview</p>
            <h2 className="font-display text-2xl font-bold">Fresh off the grill</h2>
          </div>
          <Button asChild variant="outline">
            <Link href="/menu">View full menu</Link>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {menuPreview.map((item) => (
            <div key={item.name} className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-foreground">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <span className="text-sm font-semibold text-primary">{item.price}</span>
              </div>
              <Button asChild className="mt-4 w-full">
                <Link href="/menu">Add to cart</Link>
              </Button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
