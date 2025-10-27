// src/pages/Vendor/Register.tsx
import  { useEffect, type JSX } from "react";
import { Link, useNavigate } from "react-router-dom";
// import AuthLayout from "../../components/layout/AuthLayout";
import RegisterForm from "../../features/auth/RegisterForm";
import { useAuth } from "../../features/auth/useAuth";

export default function VendorRegisterPage(): JSX.Element {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If already signed in as vendor, redirect to vendor dashboard
    if (isAuthenticated && user?.role === "vendor") {
      navigate("/vendor/dashboard", { replace: true });
    }
    // If signed in as other role, send to home
    if (isAuthenticated && user?.role && user.role !== "vendor") {
      navigate("/", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user]);

  return (
    // <AuthLayout title="Vendor registration" subtitle="Create your vendor account and start listing services">
      <div className="space-y-4">
        {/* Reuse the generic RegisterForm. If you want vendor-specific fields later (Payout info, Business name),
            create a VendorRegisterForm variant and replace this import. */}
        <RegisterForm />
        <div className="text-sm text-slate-400">
          Already registered? <Link to="/vendor/login" className="underline text-white">Sign in</Link>
        </div>
        <div className="text-sm text-slate-400">
          Need a customer account? <Link to="/customer/register" className="underline text-white">Create customer account</Link>
        </div>
      </div>
    // </AuthLayout>
  );
}
