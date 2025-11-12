// // src/pages/Vendor/Dashboard.tsx
// import { useEffect, type JSX,  } from "react";
// import { useNavigate } from "react-router-dom";
// // import MainLayout from "../../components/layout/MainLayout";
// import VendorDashboard from "../../features/vendor/VendorDashboard";
// import { useAuth } from "../../features/auth/useAuth";

// export default function VendorDashboardPage(): JSX.Element {
//   const { isAuthenticated, user } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Protect vendor routes: redirect to vendor login if not authenticated as vendor
//     if (!isAuthenticated) {
//       navigate("/vendor/login", { replace: true });
//     } else if (user?.role !== "vendor") {
//       // If authenticated but wrong role, redirect to the appropriate dashboard or home
//       if (user?.role === "customer") navigate("/customer/dashboard", { replace: true });
//       else navigate("/", { replace: true });
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [isAuthenticated, user]);

//   return (
//     // <MainLayout title="Vendor Dashboard" subtitle="Overview of services, sales and quick actions">
//       <VendorDashboard />
//     // </MainLayout>
//   );
// }
