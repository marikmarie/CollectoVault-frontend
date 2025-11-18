// src/pages/Customer/Register.tsx
import { useEffect, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import useSession  from "../../hooks/useSession";

export default function CustomerRegisterPage(): JSX.Element {
  const { user, loaded } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loaded) return;
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
  }, [loaded, user, navigate]);

  if (!loaded) return <div className="p-6 text-center text-slate-300">Checking session...</div>;

  return (
    <div className="p-6 text-center text-slate-300">
      Customer Registration Page (form goes here)
    </div>
  );
}
