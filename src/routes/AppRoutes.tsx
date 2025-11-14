// src/routes/AppRoutes.tsx
import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import MainLayout from "../components/layout/MainLayout";
import AuthLayout from "../components/layout/AuthLayout";
import Spinner from "../components/common/Spinner";
import LandingPage from "../pages/LandingPage";
import PricingPage from "../pages/Pricing";
import CustomerDashboard from "../pages/customer/dashboard/CustomerDashboard";

// CUSTOMER PAGES
import LoginForm from "../pages/LoginForm";
// import CustomerRegisterPage from "../pages/customer/CustomerRegisterPage";

// CUSTOMER FEATURES
// import RewardsCatalog from "../features/customer/RewardsCatalog";
 import RedeemReward  from "./../pages/customer/RedeemReward"
import VendorStorefront from "../pages/customer/VendorStorefront";
//import PointsAward from "../features/customer/PointsAward";
// import Checkout from "../features/customer/Checkout";
//import TransactionsHistory from "../features/customer/TransactionHistory";

// VENDOR FEATURES
import VendorDashboard from "../pages/vendor/VendorDashboard";
import ServiceList from "../pages/vendor/ServiceList";
// import VendorLoginPage from "../pages/vendor/Login";
import VendorPointRulesPage from "../pages/vendor/VendorPointRulesPage";
import VendorTierRulesPage from "../pages/vendor/VendorTierRulesPage";
import VendorCreatePackagePage from "../pages/vendor/CreatePackagePage";

// SHARED
import NotFound from "../shared/NotFound";
import Forbidden from "../shared/Forbidden";
// import VendorRegisterPage from "../pages/vendor/Register";


const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loaded } = useAuth();

  if (!loaded) {
    return <Spinner />;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};


export const AppRoutes = createBrowserRouter([
  // Public Routes
  { path: "/", element: <LandingPage /> },
  { path: "/pricing", element: <PricingPage /> },
  {path: "/dashboard", element: <CustomerDashboard />},
  {
    element: <AuthLayout title="Welcome back" subtitle="Sign in to access your CollectoVault account"/>,
    children: [
      { path: "/login", element: <LoginForm /> },
      // { path: "/register", element: <CustomerRegisterPage /> },
      //  { path: "/vendor/register", element: <VendorRegisterPage /> },
      // { path: "/vendor/login", element: <VendorLoginPage /> },
    ],
  },

  
  {
    element: (
      <ProtectedRoute>
        <MainLayout title="Rewards" subtitle="Browse rewards you can redeem with your points"/>
      </ProtectedRoute>
    ),
    children: [
      // CUSTOMER ROUTES
      //{ path: "/customer/dashboard", element: <CustomerDashboardPage /> },
      // { path: "/customer/rewards", element: <RewardsCatalog /> },
      { path: "/customer/redeem", element: <RedeemReward reward={{
          id: undefined,
          title: "",
          description: undefined,
          pointsPrice: undefined,
          currencyPrice: undefined,
          vendorName: undefined
      }} /> },
      { path: "/vendor", element: <VendorStorefront /> },
      // { path: "/customer/points-award", element: <PointsAward /> },
      // { path: "/customer/checkout", element: <Checkout /> },
      // { path: "/customer/transactions", element: <TransactionsHistory /> },
       { path: "/business", element: <VendorStorefront /> },

      // VENDOR ROUTES
      { path: "/vendor/dashboard", element: <VendorDashboard /> },
      { path: "/services", element: <ServiceList /> },
      { path: "/point-rules", element: <VendorPointRulesPage /> },
      { path: "/tier-rules", element: <VendorTierRulesPage /> },
      { path: "/create-package", element: <VendorCreatePackagePage /> },

      // ADMIN ROUTES
    //   { path: "/admin/dashboard", element: <AdminDashboard /> },
    //   { path: "/admin/vendors", element: <ManageVendors /> },
    //   { path: "/admin/customewrs", element: <ManageCustomers /> },
    //   { path: "/admin/reports", element: <Reports /> },
    ],
  },

  // ERROR ROUTES
  { path: "/forbidden", element: <Forbidden /> },
  { path: "*", element: <NotFound /> },
]);

export default AppRoutes;
