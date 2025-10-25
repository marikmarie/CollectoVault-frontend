// src/pages/Vendor/Login.tsx
import  { useEffect, type JSX } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layout/AuthLayout";
import LoginForm from "../../features/auth/LoginForm";
import { useAuth } from "../../features/auth/useAuth";

export default function VendorLoginPage(): JSX.Element {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
   
    if (isAuthenticated && user?.role === "vendor") {
      navigate("/vendor/dashboard", { replace: true });
    }
   
    if (isAuthenticated && user?.role && user.role !== "vendor") {
      navigate("/", { replace: true });
    }
    
  }, [isAuthenticated, user]);

  return (
    // <AuthLayout title="Vendor sign in" subtitle="Access your vendor dashboard and manage services">
    <div>
      <div className="space-y-4">
        <LoginForm />
        <div className="text-sm text-slate-400">
          Don't have a vendor account?{" "}
          <Link to="/vendor/register" className="underline text-white">Create one</Link>
        </div>
        <div className="text-sm text-slate-400">
          Are you a customer? <Link to="/login" className="underline text-white">Sign in as customer</Link>
        </div>
      </div>
    </div>
  );
}
