// src/pages/Customer/Dashboard.tsx
import  { useEffect , type JSX} from "react";
import { useNavigate } from "react-router-dom";
// import MainLayout from "../../components/layout/MainLayout";
import CustomerDashboard from "../../features/customer/CustomerDashboard";
// import { useAuth } from "../../features/auth/useAuth";
import { useAuth } from "../../context/AuthContext";


export default function CustomerDashboardPage(): JSX.Element {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Client-side redirect for non-authenticated users
    if (isAuthenticated) {
      navigate("/login");
      return;
    }
 
    if (user && user.role && user.role !== "customer") {
    
      if (user.role === "vendor") navigate("/vendor/dashboard");
      else if (user.role === "admin") navigate("/admin");
    }
  }, [isAuthenticated, user, navigate]);

  return (
    // <MainLayout title="Dashboard" subtitle="Your CollectoVault overview">
      <CustomerDashboard />
    // </MainLayout>
  );
}
