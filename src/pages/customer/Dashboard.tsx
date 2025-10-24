// src/pages/Customer/Dashboard.tsx
import  { useEffect , type JSX} from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import CustomerDashboard from "../../features/customer/CustomerDashboard";
import { useAuth } from "../../features/auth/useAuth";

/**
 * Page wrapper around the feature-level CustomerDashboard.
 * Ensures only authenticated customers can access this page (simple client-side guard).
 */
export default function Dashboard(): JSX.Element {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Client-side redirect for non-authenticated users
    if (!isAuthenticated) {
      navigate("/customer/login");
      return;
    }
    // block non-customer roles
    if (user && user.role && user.role !== "customer") {
      // redirect vendor/admin to their dashboards
      if (user.role === "vendor") navigate("/vendor/dashboard");
      else if (user.role === "admin") navigate("/admin");
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <MainLayout title="Dashboard" subtitle="Your CollectoVault overview">
      <CustomerDashboard />
    </MainLayout>
  );
}
