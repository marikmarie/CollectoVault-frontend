// // src/pages/Vendor/Login.tsx
// import { useEffect, type JSX } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import LoginForm from "../../features/auth/LoginForm";
// import { useSession } from "../../hooks/useSession";

// export default function VendorLoginPage(): JSX.Element {
//   const { user } = useSession();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!user) return;

//     // Vendor goes to vendor dashboard
//     if (user.role === "vendor") {
//       navigate("/vendor/dashboard", { replace: true });
//       return;
//     }

//     // Anyone else -> redirect to their correct dashboard
//     if (user.role === "customer") {
//       navigate("/customer/dashboard", { replace: true });
//       return;
//     }

//     if (user.role === "admin") {
//       navigate("/admin", { replace: true });
//       return;
//     }
//   }, [user, navigate]);

//   return (
//     <div>
//       <div className="space-y-4">
//         <LoginForm />
//         <div className="text-sm text-slate-400">
//           Don't have a collecto account?{" "}
//           <Link to="/vendor/register" className="underline text-white">
//             Create one
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }
