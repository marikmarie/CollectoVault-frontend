// src/routes/AppRoutes.tsx
import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import ROUTES from "../constants/routes";
import { useAuth } from "../features/auth/useAuth";
import Spinner from "../components/common/Spinner";
import MainLayout from "../components/layout/MainLayout";

// lazy pages — faster initial load and keeps code tidy
const LandingPage = lazy(() => import("../pages/LandingPage").catch(() => ({ default: () => <div /> })));
const CustomerLogin = lazy(() => import("../pages/Customer/Login").catch(() => ({ default: () => <div /> })));
const CustomerRegister = lazy(() => import("../pages/Customer/Register").catch(() => ({ default: () => <div /> })));
const CustomerDashboardPage = lazy(() => import("../pages/Customer/Dashboard").catch(() => ({ default: () => <div /> })));

const VendorDashboard = lazy(() => import("../features/vendor/VendorDashboard").catch(() => ({ default: () => <div /> })));
const VendorUpload = lazy(() => import("../features/vendor/UploadService").catch(() => ({ default: () => <div /> })));
const VendorServices = lazy(() => import("../features/vendor/ServiceList").catch(() => ({ default: () => <div /> })));
const VendorStorefront = lazy(() => import("../features/customer/VendorStorefront").catch(() => ({ default: () => <div /> })));

const RewardsCatalog = lazy(() => import("../features/customer/RewardsCatalog").catch(() => ({ default: () => <div /> })));
const PointsAward = lazy(() => import("../features/customer/PointsAward").catch(() => ({ default: () => <div /> })));
const Checkout = lazy(() => import("../features/customer/Checkout").catch(() => ({ default: () => <div /> })));
const TransactionsHistory = lazy(() => import("../features/customer/TransactionHistory").catch(() => ({ default: () => <div /> })));

// const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard").catch(() => ({ default: () => <div /> })));
// const ManageVendors = lazy(() => import("../pages/admin/ManageVendors").catch(() => ({ default: () => <div /> })));

const NotFound = lazy(() => import("../pages/Shared/NotFound").catch(() => ({ default: () => <div>Not found</div> })));

type ProtectedRouteProps = {
  requiredRoles?: Array<"customer" | "vendor" | "admin">;
  redirectTo?: string;
};

/**
 * ProtectedRoute component - checks authentication & roles using useAuth()
 * If user not authenticated -> redirect to login
 * If user does not have required role -> show a basic forbidden view (or redirect)
 */
function ProtectedRoute({ requiredRoles, redirectTo }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();
  // If not authenticated, redirect to appropriate login route (customer login by default)
  if (!isAuthenticated) {
    return <Navigate to={redirectTo ?? ROUTES.CUSTOMER_LOGIN} replace />;
  }

  if (requiredRoles && requiredRoles.length > 0) {
    const role = user?.role;
    if (!role || !requiredRoles.includes(role as any)) {
      // Render a simple forbidden message inside the app layout
      return (
        <MainLayout title="Forbidden" subtitle="You do not have permission to view this page">
          <div className="p-6 text-slate-300">You do not have access to this section. Contact an administrator if you believe this is an error.</div>
        </MainLayout>
      );
    }
  }

  // If authenticated and role is OK, render the nested route(s)
  return <Outlet />;
}

export default function AppRoutes(): JSX.Element {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <Spinner />
      </div>
    }>
      <Routes>
        {/* Public */}
        <Route path={ROUTES.HOME} element={<LandingPage />} />
        <Route path={ROUTES.HOW_IT_WORKS} element={<MainLayout title="How it works"><div className="p-6">How CollectoVault works — content placeholder</div></MainLayout>} />
        <Route path={ROUTES.PRICING} element={<MainLayout title="Pricing"><div className="p-6">Pricing placeholder</div></MainLayout>} />
        <Route path={ROUTES.TERMS} element={<MainLayout title="Terms"><div className="p-6">Terms placeholder</div></MainLayout>} />
        <Route path={ROUTES.PRIVACY} element={<MainLayout title="Privacy"><div className="p-6">Privacy placeholder</div></MainLayout>} />

        {/* Auth pages */}
        <Route path={ROUTES.CUSTOMER_LOGIN} element={<CustomerLogin />} />
        <Route path={ROUTES.CUSTOMER_REGISTER} element={<CustomerRegister />} />

        {/* Customer-protected */}
        <Route element={<ProtectedRoute requiredRoles={["customer"]} redirectTo={ROUTES.CUSTOMER_LOGIN} />}>
          <Route path={ROUTES.CUSTOMER_DASHBOARD} element={<CustomerDashboardPage />} />
          <Route path={ROUTES.CUSTOMER_REWARDS} element={<RewardsCatalog />} />
          <Route path={ROUTES.CUSTOMER_TRANSACTIONS} element={<TransactionsHistory />} />
          <Route path={ROUTES.CUSTOMER_CHECKOUT} element={<Checkout />} />
          <Route path={ROUTES.CUSTOMER_BUY_POINTS} element={<PointsAward />} />
        </Route>

        {/* Vendor-protected */}
        <Route element={<ProtectedRoute requiredRoles={["vendor"]} redirectTo={ROUTES.VENDOR_LOGIN} />}>
          <Route path={ROUTES.VENDOR_DASHBOARD} element={<VendorDashboard />} />
          <Route path={ROUTES.VENDOR_UPLOAD} element={<VendorUpload />} />
          <Route path={ROUTES.VENDOR_SERVICES} element={<VendorServices />} />
        </Route>

        {/* Vendor public storefront */}
        <Route path={ROUTES.VENDOR_STORE} element={<VendorStorefront />} />

        {/* Admin-protected */}
        <Route element={<ProtectedRoute requiredRoles={["admin"]} redirectTo={ROUTES.CUSTOMER_LOGIN} />}>
          <Route path={ROUTES.ADMIN_ROOT} element={<AdminDashboard />} />
          <Route path={ROUTES.ADMIN_VENDORS} element={<ManageVendors />} />
        </Route>

        {/* Fallback */}
        <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
