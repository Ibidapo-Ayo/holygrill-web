import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";
import Home from "@/app/routes/public/Home";
import MenuPage from "@/app/routes/public/Menu";
import CartPage from "@/app/routes/public/Cart";
import CheckoutPage from "@/app/routes/public/Checkout";
import LoginPage from "@/app/routes/public/Login";
import SignupPage from "@/app/routes/public/Signup";
import AccountDashboard from "@/app/routes/public/AccountDashboard";
import OrderTrackingPage from "@/app/routes/public/OrderTracking";
import RewardsPage from "@/app/routes/public/Rewards";
import MenuItemDetail from "@/app/routes/public/MenuItemDetail";
import PickupPage from "@/app/routes/public/Pickup";
import NotFound from "@/app/routes/public/NotFound";
import { SiteLayout } from "@/app/layouts/SiteLayout";
import { AdminPage } from "@/app/layouts/AdminPage";

// Admin pages (lazy loaded)
const AdminDashboard = lazy(() => import("@/app/routes/admin/Dashboard"));
const AdminOrders = lazy(() => import("@/app/routes/admin/Orders"));
const AdminMenu = lazy(() => import("@/app/routes/admin/Menu"));
const AdminUsers = lazy(() => import("@/app/routes/admin/Users"));
const AdminAnalytics = lazy(() => import("@/app/routes/admin/Analytics"));
const AdminSettings = lazy(() => import("@/app/routes/admin/Settings"));
const AdminPayments = lazy(() => import("@/app/routes/admin/Payments"));
const AdminSupport = lazy(() => import("@/app/routes/admin/Support"));

const queryClient = new QueryClient();

function AdminLoader() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-muted-foreground font-body">Loading admin...</p>
      </div>
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<AdminLoader />}>
          <Routes>
            <Route path="/" element={<SiteLayout><Home /></SiteLayout>} />
            <Route path="/menu" element={<SiteLayout title="Menu"><MenuPage /></SiteLayout>} />
            <Route path="/cart" element={<SiteLayout title="Your Cart"><CartPage /></SiteLayout>} />
            <Route path="/checkout" element={<SiteLayout title="Checkout"><CheckoutPage /></SiteLayout>} />
            <Route path="/login" element={<SiteLayout title="Login"><LoginPage /></SiteLayout>} />
            <Route path="/signup" element={<SiteLayout title="Create Account"><SignupPage /></SiteLayout>} />
            <Route path="/dashboard" element={<SiteLayout title="Dashboard"><AccountDashboard /></SiteLayout>} />
            <Route path="/orders/:id" element={<SiteLayout title="Order Tracking"><OrderTrackingPage /></SiteLayout>} />
            <Route path="/rewards" element={<SiteLayout title="Rewards"><RewardsPage /></SiteLayout>} />
            <Route path="/menu/:menuId" element={<SiteLayout><MenuItemDetail /></SiteLayout>} />
            <Route path="/pickup" element={<SiteLayout title="Pickup Window"><PickupPage /></SiteLayout>} />
            <Route path="/admin" element={<AdminPage title="Overview" subtitle="Performance & insights"><AdminDashboard /></AdminPage>} />
            <Route path="/admin/orders" element={<AdminPage title="Orders" subtitle="Manage live orders"><AdminOrders /></AdminPage>} />
            <Route path="/admin/payments" element={<AdminPage title="Payments" subtitle="Transactions & payouts"><AdminPayments /></AdminPage>} />
            <Route path="/admin/menu" element={<AdminPage title="Menu" subtitle="Menu management"><AdminMenu /></AdminPage>} />
            <Route path="/admin/users" element={<AdminPage title="Users" subtitle="Customer profiles & HP"><AdminUsers /></AdminPage>} />
            <Route path="/admin/analytics" element={<AdminPage title="Analytics" subtitle="Business insights"><AdminAnalytics /></AdminPage>} />
            <Route path="/admin/support" element={<AdminPage title="Support" subtitle="Tickets & responses"><AdminSupport /></AdminPage>} />
            <Route path="/admin/settings" element={<AdminPage title="Settings" subtitle="Configure your store"><AdminSettings /></AdminPage>} />
            <Route path="*" element={<SiteLayout><NotFound /></SiteLayout>} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
