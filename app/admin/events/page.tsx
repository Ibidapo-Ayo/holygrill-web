'use client';

import { AdminPage } from '@/app/layouts/AdminPage';
import { AdminModulePage } from '@/components/admin/AdminModulePage';
import { ADMIN_MODULE_ROWS } from '@/services/mocks/platform';

export default function Page() {
  return <AdminPage title="Events Manager" subtitle="Campus activations and catering pipelines"><AdminModulePage title="Events Manager" description="Review catering requests, event inventory, and approvals with shared admin controls." rows={ADMIN_MODULE_ROWS.events} /></AdminPage>;
}
