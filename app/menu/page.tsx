import MenuPage from '@/app/routes/public/Menu';
import { SiteLayout } from '@/app/layouts/SiteLayout';
import { getMenuItems } from '@/services/api/menu.service';
import type { MenuItem } from '@/types';

export default async function Page() {
  let initialMenu: MenuItem[] = [];
  let initialLoadFailed = false;

  try {
    initialMenu = await getMenuItems();
  } catch {
    initialLoadFailed = true;
  }

  return (
    <SiteLayout title="Menu">
      <MenuPage initialMenu={initialMenu} initialLoadFailed={initialLoadFailed} />
    </SiteLayout>
  );
}
