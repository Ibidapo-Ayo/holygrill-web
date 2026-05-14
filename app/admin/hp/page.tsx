'use client';

import { AdminPage } from '@/app/layouts/AdminPage';
import { AdminModulePage } from '@/components/admin/AdminModulePage';
import { ADMIN_MODULE_ROWS } from '@/services/mocks/platform';

export default function Page() {
  return <AdminPage title="HP Manager" subtitle="Tune the loyalty economy"><AdminModulePage title="HP Manager" description="Control earn rules, redemptions, streaks, and review bonuses with backend-ready placeholders." rows={ADMIN_MODULE_ROWS.hp} /></AdminPage>;
}
