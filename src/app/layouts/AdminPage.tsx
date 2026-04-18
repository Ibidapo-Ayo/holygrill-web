import { ReactNode } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';

interface AdminPageProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function AdminPage({ title, subtitle, children }: AdminPageProps) {
  return (
    <AdminLayout title={title} subtitle={subtitle}>
      {children}
    </AdminLayout>
  );
}
