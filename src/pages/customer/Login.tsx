// src/pages/Customer/Login.tsx
import  { useEffect , type JSX} from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layout/AuthLayout";
import LoginForm from "../../features/auth/LoginForm";
import { useAuth } from "../../features/auth/useAuth";

export default function Login(): JSX.Element {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in, redirect to dashboard
    if (isAuthenticated) {
      // route based on role
      if (user?.role === "vendor") navigate("/vendor/dashboard");
      else if (user?.role === "admin") navigate("/admin");
      else navigate("/customer/dashboard");
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to access your CollectoVault account">
      <LoginForm />
    </AuthLayout>
  );
}
