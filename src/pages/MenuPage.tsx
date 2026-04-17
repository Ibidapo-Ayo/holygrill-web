import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { MobileHeader } from '@/components/layout/MobileHeader';
import { Footer } from '@/components/layout/Footer';
import { FoodCard } from '@/components/menu/FoodCard';
import { CategoryTabs } from '@/components/menu/CategoryTabs';
import { SearchBar } from '@/components/menu/SearchBar';
import { useCartStore } from '@/stores/cartStore';
import { MOCK_MENU, CATEGORIES } from '@/data/menu';
import { toast } from 'sonner';

const MenuPage = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const { items, addItem, updateQuantity } = useCartStore();

  const filtered = useMemo(() => {
    return MOCK_MENU.filter((item) => {
      const matchCat = category === 'All' || item.category === category;
      const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase()) || item.description.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [search, category]);

  const handleAdd = (id: string) => {
    const item = MOCK_MENU.find((m) => m.id === id);
    if (!item) return;
    addItem({ id: item.id, name: item.name, price: item.price, imageUrl: item.imageUrl, hpValue: item.hpValue });
    toast.success(`${item.name} added to cart 🔥`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background with-tabbar md:pb-0">
      <Navbar />
      <MobileHeader title="Menu" />
      <main className="flex-1 md:pt-16">
        {/* Sticky header */}
        <div className="sticky top-14 md:top-16 z-30 bg-background/85 backdrop-blur-xl border-b border-border">
          <div className="container mx-auto px-4 py-4 space-y-3">
            <SearchBar value={search} onChange={setSearch} />
            <CategoryTabs categories={CATEGORIES} activeCategory={category} onChange={setCategory} />
          </div>
        </div>

        {/* Grid */}
        <div className="container mx-auto px-4 py-8">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground font-body text-sm">No items found for "{search || category}"</p>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              <AnimatePresence mode="popLayout">
                {filtered.map((item) => (
                  <FoodCard
                    key={item.id}
                    {...item}
                    quantityInCart={items.find((c) => c.id === item.id)?.quantity}
                    onAddToCart={handleAdd}
                    onUpdateQuantity={(id, qty) => updateQuantity(id, qty)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MenuPage;
