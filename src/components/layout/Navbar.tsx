
import { useState, type JSX } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ROUTES from "../../constants/routes";

/**
 * Behavior:
 * - If user.role === 'vendoradmin' OR the current pathname looks like vendor area -> show Vendor Sign Up
 * - Otherwise show Customer Sign Up
 *
 * Note: ROUTES currently doesn't include a vendor register constant, so we link to '/vendor/register'.
 * Adjust ROUTES if you want a centralized constant.
 */
export default function Navbar(): JSX.Element {
  const [open, setOpen] = useState(false);
  const { user, logout } = (useAuth() as any) ?? { user: null, logout: undefined };
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await (logout ? logout() : Promise.resolve());
    } catch (err) {
      
    } finally {
      navigate(ROUTES.ROOT ?? "/");
    }
  };

  const isVendorContext = (() => {
    try {
      if (user?.role === "vendor") return true;
      
      if (location.pathname.startsWith("/vendor")) return true;
     
      return false;
    } catch {
      return false;
    }
  })();

  const signUpLink = isVendorContext ? "/vendor/register" : (ROUTES.REGISTER ?? "/register");
  const signInLink = isVendorContext ? (ROUTES.VENDOR?.LOGIN ?? "/vendor/login") : (ROUTES.LOGIN ?? "/login");

  return (
    <nav className="bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 text-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left: Logo */}
          <div className="flex items-center gap-4">
            <Link to={ROUTES.ROOT ?? "/"} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-linear-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="white" />
                </svg>
              </div>
              <div className="hidden sm:block">
                <div className="text-lg font-extrabold">CollectoVault</div>
                <div className="text-xs text-slate-300 -mt-1">Power your loyalty</div>
              </div>
            </Link>
          </div>

          {/* Center: nav links (desktop) */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link to={ROUTES.ROOT ?? "/"} className="text-sm hover:underline">Home</Link>
            <Link to={ROUTES.CUSTOMER.VENDORSTOREFRONT ?? "/vendor"} className="text-sm hover:underline">Services</Link>
            <Link to="#how-it-works" className="text-sm hover:underline">How it works</Link>
            <Link to={ROUTES.PRICING ?? "/pricing"} className="text-sm hover:underline">Pricing</Link>
            <Link to={ROUTES.CUSTOMER.REWARDS ?? "/customer/rewards"} className="text-sm hover:underline">Rewards</Link>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex sm:items-center sm:gap-3">
              <Link
                to={ROUTES.CUSTOMER.BUYPOINTS ?? "/buy-points"}
                className="px-3 py-1.5 rounded-md bg-white text-slate-900 text-sm font-semibold shadow-sm hover:brightness-95"
              >
                Buy Points
              </Link>

              {!user && (
                <>
                  <Link to={signUpLink} className="px-3 py-1.5 rounded-md bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600">
                    Sign up
                  </Link>
                  <Link to={signInLink} className="text-sm px-3 py-1.5 rounded-md border border-slate-700 hover:bg-slate-800">
                    Sign in
                  </Link>
                </>
              )}

              {user && (
                <div className="relative">
                  <button
                    onClick={() => setOpen((s) => !s)}
                    className="flex items-center gap-2 p-1 rounded-md hover:bg-slate-800"
                    aria-expanded={open}
                    aria-haspopup="true"
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden">
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.name ?? "avatar"} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-sm font-medium text-white">{(user.name || user.email || "U").charAt(0)}</span>
                      )}
                    </div>
                    <div className="hidden sm:flex sm:flex-col text-left">
                      <span className="text-sm font-medium">{user.name ?? user.email}</span>
                      <span className="text-xs text-slate-400">Balance: <span className="font-semibold">{(user.points ?? 0).toLocaleString()} pts</span></span>
                    </div>
                    <svg className="w-4 h-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                    </svg>
                  </button>

                  {/* dropdown */}
                  {open && (
                    <div className="absolute right-0 mt-2 w-56 bg-slate-800 rounded-md p-2 shadow-lg z-50">
                      <Link to={ROUTES.CUSTOMER.DASHBOARD ?? "/customer/dashboard"} className="block px-3 py-2 rounded hover:bg-slate-700">Dashboard</Link>
                      <Link to="/customer/profile" className="block px-3 py-2 rounded hover:bg-slate-700">Profile</Link>
                      <Link to={ROUTES.CUSTOMER.TRANSACTIONS ?? "/customer/transactions"} className="block px-3 py-2 rounded hover:bg-slate-700">Transactions</Link>

                      {/* Vendor admin management links (if logged in and role is admin-ish) */}
                      {user?.role === "admin" && (
                        <>
                          <div className="border-t border-slate-700 my-1" />
                          <Link to={ROUTES.ADMIN.DASHBOARD ?? "/admin/dashboard"} className="block px-3 py-2 rounded hover:bg-slate-700">Admin</Link>
                          <Link to={ROUTES.ADMIN.VENDORS ?? "/admin/vendors"} className="block px-3 py-2 rounded hover:bg-slate-700">Manage vendors</Link>
                        </>
                      )}

                      <div className="border-t border-slate-700 my-1" />
                      <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded hover:bg-slate-700">Sign out</button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <div className="md:hidden">
              <button
                onClick={() => setOpen((s) => !s)}
                className="p-2 rounded-md hover:bg-slate-800"
                aria-label="Toggle menu"
              >
                {!open ? (
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu content */}
      {open && (
        <div className="md:hidden bg-slate-900/95 border-t border-slate-800">
          <div className="px-4 pt-4 pb-6 space-y-3">
            <Link to={ROUTES.ROOT ?? "/"} className="block px-2 py-2 rounded hover:bg-slate-800">Home</Link>
            <Link to={ROUTES.CUSTOMER.VENDORSTOREFRONT ?? "/vendor"} className="block px-2 py-2 rounded hover:bg-slate-800">Services</Link>
            <Link to="#how-it-works" className="block px-2 py-2 rounded hover:bg-slate-800">How it works</Link>
            <Link to={ROUTES.PRICING ?? "/pricing"} className="block px-2 py-2 rounded hover:bg-slate-800">Pricing</Link>
            <Link to={ROUTES.CUSTOMER.REWARDS ?? "/customer/rewards"} className="block px-2 py-2 rounded hover:bg-slate-800">Rewards</Link>

            <div className="pt-2 border-t border-slate-800" />

            <Link to="/buy-points" className="block px-2 py-2 rounded bg-emerald-500 text-white text-center">Buy Points</Link>

            {!user && (
              <div className="pt-2">
                <Link to={signInLink} className="block px-2 py-2 rounded hover:bg-slate-800">Sign in</Link>
                <Link to={signUpLink} className="block mt-1 px-2 py-2 rounded bg-white text-slate-900 text-center">Sign up</Link>
              </div>
            )}

            {user && (
              <div className="pt-2 space-y-1">
                <Link to={ROUTES.CUSTOMER.DASHBOARD ?? "/customer/dashboard"} className="block px-2 py-2 rounded hover:bg-slate-800">Dashboard</Link>
                <Link to="/customer/profile" className="block px-2 py-2 rounded hover:bg-slate-800">Profile</Link>
                <button onClick={handleLogout} className="w-full text-left px-2 py-2 rounded hover:bg-slate-800">Sign out</button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}


// import  { useState, type JSX } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext"; // existing hook in your project

// import ROUTES from "../../constants/routes";

// export default function Navbar(): JSX.Element {
//   const [open, setOpen] = useState(false);
//   const { user, logout } = (useAuth() as any) ?? { user: null, logout: undefined };
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     try {
//       await (logout ? logout() : Promise.resolve());
//     } catch (err) {
//       // ignore for now
//     } finally {
//       navigate("/");
//     }
//   };

//   return (
//     <nav className="bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 text-white shadow">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16 items-center">
//           {/* Left: Logo */}
//           <div className="flex items-center gap-4">
//             <Link to="/" className="flex items-center gap-3">
             
//               <div className="w-10 h-10 rounded-lg bg-linear-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow">
//                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
//                   <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="white" />
//                 </svg>
//               </div>
//               <div className="hidden sm:block">
//                 <div className="text-lg font-extrabold">CollectoVault</div>
//                 <div className="text-xs text-slate-300 -mt-1">Power your loyalty</div>
//               </div>
//             </Link>
//           </div>

//           {/* Center: nav links (desktop) */}
//           <div className="hidden md:flex md:items-center md:space-x-6">
//             <Link to="/" className="text-sm hover:underline">Home</Link>
//             <Link to="/vendor" className="text-sm hover:underline">Vendors</Link>
//             <Link to="/how-it-works" className="text-sm hover:underline">How it works</Link>
//             <Link to="/pricing" className="text-sm hover:underline">Pricing</Link>
//             <Link to="/customer/rewards" className="text-sm hover:underline">Rewards</Link>
//           </div>

//           {/* Right: actions */}
//           <div className="flex items-center gap-3">
//             <div className="hidden sm:flex sm:items-center sm:gap-3">
//               <Link
//                 to="/buy-points"
//                 className="px-3 py-1.5 rounded-md bg-white text-slate-900 text-sm font-semibold shadow-sm hover:brightness-95"
//               >
//                 Buy Points
//               </Link>

//               {!user && (
//                 <>
//                   <Link to={ROUTES.REGISTER} className="px-3 py-1.5 rounded-md bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600">
//                     Sign up
//                   </Link>
//                   <Link to="/login" className="text-sm px-3 py-1.5 rounded-md border border-slate-700 hover:bg-slate-800">
//                     Sign in
//                   </Link>
//                 </>
//               )}

//               {user && (
//                 <div className="relative">
//                   <button
//                     onClick={() => setOpen((s) => !s)}
//                     className="flex items-center gap-2 p-1 rounded-md hover:bg-slate-800"
//                     aria-expanded={open}
//                     aria-haspopup="true"
//                   >
//                     <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden">
//                       {user.avatarUrl ? (
//                         <img src={user.avatarUrl} alt={user.name ?? "avatar"} className="w-full h-full object-cover" />
//                       ) : (
//                         <span className="text-sm font-medium text-white">{(user.name || user.email || "U").charAt(0)}</span>
//                       )}
//                     </div>
//                     <div className="hidden sm:flex sm:flex-col text-left">
//                       <span className="text-sm font-medium">{user.name ?? user.email}</span>
//                       <span className="text-xs text-slate-400">Balance: <span className="font-semibold">1,240 pts</span></span>
//                     </div>
//                     <svg className="w-4 h-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
//                       <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
//                     </svg>
//                   </button>

//                   {/* dropdown */}
//                   {open && (
//                     <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-md p-2 shadow-lg z-50">
//                       <Link to="/customer/dashboard" className="block px-3 py-2 rounded hover:bg-slate-700">Dashboard</Link>
//                       <Link to="/customer/profile" className="block px-3 py-2 rounded hover:bg-slate-700">Profile</Link>
//                       <Link to="/customer/transactions" className="block px-3 py-2 rounded hover:bg-slate-700">Transactions</Link>
//                       <div className="border-t border-slate-700 my-1" />
//                       <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded hover:bg-slate-700">Sign out</button>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* Mobile menu toggle */}
//             <div className="md:hidden">
//               <button
//                 onClick={() => setOpen((s) => !s)}
//                 className="p-2 rounded-md hover:bg-slate-800"
//                 aria-label="Toggle menu"
//               >
//                 {!open ? (
//                   <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
//                   </svg>
//                 ) : (
//                   <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>


//       {/* Mobile menu content */}
//       {open && (
//         <div className="md:hidden bg-slate-900/95 border-t border-slate-800">
//           <div className="px-4 pt-4 pb-6 space-y-3">
//             <Link to="/" className="block px-2 py-2 rounded hover:bg-slate-800">Home</Link>
//             <Link to="/vendors" className="block px-2 py-2 rounded hover:bg-slate-800">Vendors</Link>
//             <Link to="/how-it-works" className="block px-2 py-2 rounded hover:bg-slate-800">How it works</Link>
//             <Link to="/customer/rewards" className="block px-2 py-2 rounded hover:bg-slate-800">Rewards</Link>

//             <div className="pt-2 border-t border-slate-800" />

//             <Link to="/buy-points" className="block px-2 py-2 rounded bg-emerald-500 text-white text-center">Buy Points</Link>

//             {!user && (
//               <div className="pt-2">
//                 <Link to="/login" className="block px-2 py-2 rounded hover:bg-slate-800">Sign in</Link>
//                 <Link to="/customer/register" className="block mt-1 px-2 py-2 rounded bg-white text-slate-900 text-center">Sign up</Link>
//               </div>
//             )}

//             {user && (
//               <div className="pt-2 space-y-1">
//                 <Link to="/customer/dashboard" className="block px-2 py-2 rounded hover:bg-slate-800">Dashboard</Link>
//                 <Link to="/customer/profile" className="block px-2 py-2 rounded hover:bg-slate-800">Profile</Link>
//                 <button onClick={handleLogout} className="w-full text-left px-2 py-2 rounded hover:bg-slate-800">Sign out</button>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </nav>
//   );

// }
