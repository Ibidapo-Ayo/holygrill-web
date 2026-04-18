import { ReactNode } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { MobileHeader } from '@/components/layout/MobileHeader';
import { Footer } from '@/components/layout/Footer';
import { BottomTabBar } from '@/components/layout/BottomTabBar';

interface SiteLayoutProps {
  title?: string;
  children: ReactNode;
}

export function SiteLayout({ title, children }: SiteLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background with-tabbar md:pb-0">
      <Navbar />
      <MobileHeader title={title} />
      <div className="flex-1 flex flex-col">{children}</div>
      <Footer />
      <BottomTabBar />
    </div>
  );
}
