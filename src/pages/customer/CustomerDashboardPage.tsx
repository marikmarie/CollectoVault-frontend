
// // src/pages/Customer/Dashboard.tsx
// import { useEffect, type JSX } from "react";
// import { useNavigate } from "react-router-dom";
// import CustomerDashboard from "../../features/customer/CustomerDashboard";
// import useSession from "../../hooks/useSession";

// export default function CustomerDashboardPage(): JSX.Element {
//   const { isAuthenticated, user, loading: sessionLoading } = useSession();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (sessionLoading) return;

//     if (!isAuthenticated) {
//       navigate("/login", { replace: true });
//       return;
//     }

//     // Authenticated but wrong role → redirect
//     if (user?.role && user.role !== "customer") {
//       if (user.role === "vendor") navigate("/vendor/dashboard");
//       else if (user.role === "admin") navigate("/admin");
//     }
//   }, [isAuthenticated, user, sessionLoading, navigate]);

//   return <CustomerDashboard />;
// }
