"use client";

import { useMemo } from "react";
import { Flame, Salad } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMenu } from "@/app/context/MenuContext";

const menuItems = [
  { name: "Suya Burger", price: "₦3,800", category: "grills", description: "Charred beef, suya spice, caramelised onions." },
  { name: "Pepper Wings", price: "₦3,200", category: "grills", description: "Fire-grilled wings with palm honey glaze." },
  { name: "Loaded Shawarma", price: "₦2,900", category: "wraps", description: "Roasted chicken, veggies, spicy mayo." },
  { name: "Garden Bowl", price: "₦2,600", category: "bowls", description: "Grains, grilled veggies, sesame crunch." },
];

const categories = [
  { id: "all", label: "All" },
  { id: "grills", label: "Grills" },
  { id: "wraps", label: "Wraps" },
  { id: "bowls", label: "Bowls" },
];

export default function MenuPage() {
  const { activeCategory, setActiveCategory } = useMenu();

  const filtered = useMemo(() => {
    if (activeCategory === "all") return menuItems;
    return menuItems.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="container space-y-8 py-10">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Menu</p>
        <h1 className="font-display text-3xl font-bold">Pick your craving</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Fresh grills, bold spices, and Holy Points on every order.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Button
            key={cat.id}
            variant={activeCategory === cat.id ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((item) => (
          <Card key={item.name} className="border-border/70 bg-card shadow-card">
            <CardHeader className="flex-row items-start justify-between space-y-0">
              <CardTitle className="text-lg">{item.name}</CardTitle>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{item.price}</span>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>{item.description}</p>
              <div className="flex items-center gap-3 text-xs">
                <span className="inline-flex items-center gap-1 text-primary">
                  <Flame size={14} /> Earn HP
                </span>
                <span className="inline-flex items-center gap-1 text-foreground">
                  <Salad size={14} /> Fresh daily
                </span>
              </div>
              <Button className="w-full">Add to cart</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
