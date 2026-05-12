"use client";

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { FoodCard } from '@/components/menu/FoodCard';
import { CategoryTabs } from '@/components/menu/CategoryTabs';
import { SearchBar } from '@/components/menu/SearchBar';
import { FoodCardSkeleton } from '@/components/menu/FoodCardSkeleton';
import { StatusStrip } from '@/components/shared/StatusStrip';
import { useCartStore } from '@/stores/cartStore';
import { getMenuItems } from '@/services/api/menu.service';
import { getCartQuantityForMenuItem, getPrimaryCartLineId } from '@/utils/pricing';
import type { MenuItem } from '@/types';
import { toast } from 'sonner';

const MenuPage = ({ initialMenu }: { initialMenu: MenuItem[] }) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const { items, addItem, updateQuantity } = useCartStore();

  const { data: menuItems = initialMenu, isFetching, isError } = useQuery({
    queryKey: ['menu-items'],
    queryFn: getMenuItems,
    initialData: initialMenu,
  });

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(menuItems.map((item) => item.category)))],
    [menuItems]
  );

  const filtered = useMemo(
    () => menuItems.filter((item) => {
      const matchCategory = category === 'All' || item.category === category;
      const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase()) || item.description.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchSearch;
    }),
    [category, menuItems, search]
  );

  const handleAdd = (id: string) => {
    const item = menuItems.find((entry) => entry.id === id);
    if (!item) return;
    addItem({ id: item.id, menuItemId: item.id, name: item.name, price: item.price, imageUrl: item.imageUrl, hpValue: item.hpValue });
    toast.success(`${item.name} added to cart`);
  };

  return (
    <main className="flex-1 md:pt-16">
      <div className="border-b border-border bg-card/50">
        <div className="container mx-auto space-y-4 px-4 py-6">
          <StatusStrip compact />
          <div className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Squad order</p>
              <h1 className="mt-1 font-display text-2xl font-bold text-foreground">Server-rendered menu, instant filtering.</h1>
              <p className="mt-1 text-sm text-muted-foreground">Browse first, filter fast, and keep slow networks from blocking the first paint.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-2 text-sm font-semibold text-primary">
              <Users size={16} /> Group delivery slots open
            </div>
          </div>
        </div>
      </div>

      <div className="sticky top-14 z-30 border-b border-border bg-background/85 backdrop-blur-xl md:top-16">
        <div className="container mx-auto space-y-3 px-4 py-4">
          <SearchBar value={search} onChange={setSearch} />
          <CategoryTabs categories={categories} activeCategory={category} onChange={setCategory} />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {isError ? <p className="mb-4 text-sm text-destructive">Unable to refresh the latest menu right now. Showing the server-rendered menu instead.</p> : null}
        {isFetching && !menuItems.length ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => <FoodCardSkeleton key={index} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-card/60 px-6 py-14 text-center text-sm text-muted-foreground">
            No menu items matched “{search || category}”. Try another filter.
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((item) => (
                <FoodCard
                  key={item.id}
                  {...item}
                  quantityInCart={getCartQuantityForMenuItem(items, item.id)}
                  onAddToCart={handleAdd}
                  onUpdateQuantity={(_, quantity) => updateQuantity(getPrimaryCartLineId(items, item.id), quantity)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </main>
  );
};

export default MenuPage;
