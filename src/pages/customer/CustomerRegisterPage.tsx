// src/pages/Customer/Register.tsx
import { useEffect, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import RegisterForm from "../../features/auth/RegisterForm";
import { useSession } from "../../hooks/useSession";

export default function CustomerRegisterPage(): JSX.Element {
  const { user, loading } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    // If already logged in → redirect based on role
    if (user) {
      switch (user.role) {
        case "vendor":
          navigate("/vendor/dashboard");
          break;
        case "admin":
          navigate("/admin");
          break;
        default:
          navigate("/customer/dashboard");
      }
    }
  }, [loading, user, navigate]);

  // Avoid showing form until we know session state
  if (loading) return <div className="p-6 text-center text-slate-300">Checking session...</div>;

  return <RegisterForm />;
}
