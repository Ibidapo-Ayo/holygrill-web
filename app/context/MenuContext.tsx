"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

type MenuContextValue = {
  activeCategory: string;
  setActiveCategory: (value: string) => void;
};

const MenuContext = createContext<MenuContextValue | undefined>(undefined);

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const value = useMemo(
    () => ({
      activeCategory,
      setActiveCategory,
    }),
    [activeCategory],
  );

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

export function useMenu() {
  const ctx = useContext(MenuContext);
  if (!ctx) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return ctx;
}
