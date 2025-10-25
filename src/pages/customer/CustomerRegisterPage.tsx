// src/pages/Customer/Register.tsx
import  { useEffect, type JSX } from "react";
import { useNavigate } from "react-router-dom";
// import AuthLayout from "../../components/layout/AuthLayout";
import RegisterForm from "../../features/auth/RegisterForm";
import { useAuth } from "../../features/auth/useAuth";

export default function CustomerRegisterPage(): JSX.Element {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in, no need to register
    if (isAuthenticated) {
      if (user?.role === "vendor") navigate("/vendor/dashboard");
      else if (user?.role === "admin") navigate("/admin");
      else navigate("/customer/dashboard");
    }
  }, [isAuthenticated, user, navigate]);

  return (
    // <AuthLayout title="Create your account" subtitle="Sign up to start collecting points and redeeming rewards">
      <RegisterForm />
    // </AuthLayout>
  );
}
