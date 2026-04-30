"use client";

import MenuPage from "@/app/routes/public/Menu";
import { SiteLayout } from "@/app/layouts/SiteLayout";

export default function Page() {
  return <SiteLayout title="Menu"><MenuPage /></SiteLayout>;
}
