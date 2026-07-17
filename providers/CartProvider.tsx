"use client";

import { useCartQuery } from '@/hooks/useCart';

export default function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useCartQuery();

  return <>{children}</>;
}