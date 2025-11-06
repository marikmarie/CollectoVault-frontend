// src/pages/Customer/Dashboard.tsx
import { useEffect, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import CustomerDashboard from "../../features/customer/CustomerDashboard";
import useSession from "../../hooks/useSession"; // ✅ use new session hook

export default function CustomerDashboardPage(): JSX.Element {
  const { isAuthenticated, user } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    // If NOT authenticated → go to login
    if (!isAuthenticated) {
      navigate("/login",  { replace: true });
      return;
    }

    // Authenticated but wrong role → redirect
    if (user?.role && user.role !== "customer") {
      if (user.role === "vendor") navigate("/vendor/dashboard");
      else if (user.role === "admin") navigate("/admin");
     // else navigate("/customer/dashboard")
    }
  }, [isAuthenticated, user]);
  //}, [isAuthenticated, user, navigate]);

  return (
  <CustomerDashboard />
  );
}
