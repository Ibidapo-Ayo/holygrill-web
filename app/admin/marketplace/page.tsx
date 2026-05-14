'use client';

import { AdminPage } from '@/app/layouts/AdminPage';
import { AdminModulePage } from '@/components/admin/AdminModulePage';
import { ADMIN_MODULE_ROWS } from '@/services/mocks/platform';

export default function Page() {
  return <AdminPage title="Marketplace Manager" subtitle="Control external drops and vendor launches"><AdminModulePage title="Marketplace Manager" description="Manage categories, vendors, lock states, and launch readiness from one reusable shell." rows={ADMIN_MODULE_ROWS.marketplace} /></AdminPage>;
}
