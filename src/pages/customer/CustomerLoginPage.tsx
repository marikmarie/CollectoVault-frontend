// src/pages/Customer/Login.tsx
import { useEffect, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../../features/auth/LoginForm";
import useSession from "../../hooks/useSession"; // <-- new session hook

export default function CustomerLoginPage(): JSX.Element {
  const { isAuthenticated, user } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) return;

    // Redirect depending on role
    if (user?.role === "vendor") {
      navigate("/vendor/dashboard");
    } else if (user?.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/customer/dashboard");
    }
  }, [isAuthenticated, user, navigate]);

  return <LoginForm />;
}
