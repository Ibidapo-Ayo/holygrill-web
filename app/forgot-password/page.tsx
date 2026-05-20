"use client";

import ForgotPasswordPage from "@/app/routes/public/ForgotPassword";
import { SiteLayout } from "@/app/layouts/SiteLayout";

export default function Page() {
  return <SiteLayout title="Forgot Password" hideChrome><ForgotPasswordPage /></SiteLayout>;
}
