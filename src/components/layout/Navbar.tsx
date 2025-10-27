// src/components/layout/Navbar.tsx
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ROUTES from "../../constants/routes";
import { useAuth } from "../../context/AuthContext";

export default function Navbar(): JSX.Element {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const { user, logout } = (useAuth() as any) ?? { user: null, logout: undefined };
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await (logout ? logout() : Promise.resolve());
    } finally {
      // close menus and go home
      setUserMenuOpen(false);
      setMobileOpen(false);
      navigate(ROUTES.HOME);
    }
  };

  const goToRoleDashboard = () => {
    if (!user?.role) return navigate(ROUTES.CUSTOMER_DASHBOARD);
    switch (user.role) {
      case "vendor":
        return navigate(ROUTES.VENDOR_DASHBOARD);
      case "admin":
        return navigate(ROUTES.ADMIN_ROOT);
      case "staff":
        // staff currently treated similar to admin — change if you add staff routes
        return navigate(ROUTES.ADMIN_ROOT);
      default:
        return navigate(ROUTES.CUSTOMER_DASHBOARD);
    }
  };

  // Scroll to the "How it works" section on the landing page.
  // If already on home, try to find element by id 'how-it-works' and scroll.
  // If not on home, navigate to home then attempt scroll after a short delay.
  const handleHowItWorks = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const scrollToSection = () => {
      const el = document.getElementById("how-it-works") || document.querySelector("section[id='how-it-works']");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        // fallback: scroll to ~1/3 down the page
        window.scrollTo({ top: window.innerHeight * 0.6, behavior: "smooth" });
      }
    };

    if (location.pathname === ROUTES.HOME) {
      scrollToSection();
    } else {
      // navigate to home then try to scroll after a short delay
      navigate(ROUTES.HOME);
      setTimeout(scrollToSection, 350);
    }
    // close mobile menu if open
    setMobileOpen(false);
  };

  // Helper to get current user points safely
  const userPoints = (user?.points ?? 0).toLocaleString();

  return (
    <nav className="bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 text-white shadow z-40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* left: brand */}
          <div className="flex items-center gap-4">
            <Link to={ROUTES.HOME} className="flex items-center gap-3">
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

          {/* center links (desktop) */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link to={ROUTES.HOME} className="text-sm hover:underline">Home</Link>
            <Link to={ROUTES.SERVICES} className="text-sm hover:underline">Services</Link>
            {/* use click handler so we can scroll into the landing page section */}
            <a href={ROUTES.HOW_IT_WORKS} onClick={handleHowItWorks} className="text-sm hover:underline">How it works</a>
            <Link to={ROUTES.PRICING} className="text-sm hover:underline">Pricing</Link>
            <Link to={ROUTES.CUSTOMER_REWARDS} className="text-sm hover:underline">Rewards</Link>
          </div>

          {/* right actions */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex sm:items-center sm:gap-3">
              <Link
                to={ROUTES.CUSTOMER_BUY_POINTS}
                className="px-3 py-1.5 rounded-md bg-white text-slate-900 text-sm font-semibold shadow-sm hover:brightness-95"
              >
                Buy Points
              </Link>

              {/* Guest view */}
              {!user && (
                <>
                  <Link to={ROUTES.CUSTOMER_REGISTER} className="px-3 py-1.5 rounded-md bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600">
                    Sign up
                  </Link>

                  <div className="flex gap-1">
                    <Link to={ROUTES.CUSTOMER_LOGIN} className="text-sm px-3 py-1.5 rounded-md border border-slate-700 hover:bg-slate-800">
                      Customer Sign in
                    </Link>
                    <Link to={ROUTES.VENDOR_LOGIN} className="text-sm px-3 py-1.5 rounded-md border border-slate-700 hover:bg-slate-800">
                      Vendor Sign in
                    </Link>
                  </div>
                </>
              )}

              {/* Authenticated view */}
              {user && (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(s => !s)}
                    className="flex items-center gap-2 p-1 rounded-md hover:bg-slate-800"
                    aria-expanded={userMenuOpen}
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
                      <span className="text-xs text-slate-400">Balance: <span className="font-semibold">{userPoints} pts</span></span>
                    </div>

                    <svg className="w-4 h-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                    </svg>
                  </button>

                  {/* user dropdown */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-slate-800 rounded-md p-2 shadow-lg z-50">
                      <button onClick={() => { setUserMenuOpen(false); goToRoleDashboard(); }} className="w-full text-left px-3 py-2 rounded hover:bg-slate-700">Dashboard</button>

                      {/* customer-only links */}
                      {user.role === "customer" && (
                        <>
                          <Link to={ROUTES.CUSTOMER_TRANSACTIONS} className="block px-3 py-2 rounded hover:bg-slate-700">Transactions</Link>
                          <Link to="/customer/profile" className="block px-3 py-2 rounded hover:bg-slate-700">Profile</Link>
                        </>
                      )}

                      {/* vendor-specific links */}
                      {user.role === "vendor" && (
                        <>
                          <Link to={ROUTES.VENDOR_UPLOAD} className="block px-3 py-2 rounded hover:bg-slate-700">Upload service</Link>
                          <Link to={ROUTES.VENDOR_SERVICES} className="block px-3 py-2 rounded hover:bg-slate-700">My services</Link>
                        </>
                      )}

                      {/* admin-specific */}
                      {user.role === "admin" && (
                        <>
                          <Link to={ROUTES.ADMIN_ROOT} className="block px-3 py-2 rounded hover:bg-slate-700">Admin</Link>
                          <Link to={ROUTES.ADMIN_VENDORS} className="block px-3 py-2 rounded hover:bg-slate-700">Manage vendors</Link>
                        </>
                      )}

                      <div className="border-t border-slate-700 my-1" />
                      <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded hover:bg-slate-700">Sign out</button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* mobile toggle */}
            <div className="md:hidden">
              <button
                onClick={() => { setMobileOpen(s => !s); setUserMenuOpen(false); }}
                className="p-2 rounded-md hover:bg-slate-800"
                aria-label="Toggle menu"
              >
                {!mobileOpen ? (
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

      {/* mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-slate-900/95 border-t border-slate-800">
          <div className="px-4 pt-4 pb-6 space-y-3">
            <Link to={ROUTES.HOME} className="block px-2 py-2 rounded hover:bg-slate-800">Home</Link>
            <Link to={ROUTES.SERVICES} className="block px-2 py-2 rounded hover:bg-slate-800">Services</Link>
            <a href={ROUTES.HOW_IT_WORKS} onClick={(e) => { handleHowItWorks(e); setMobileOpen(false); }} className="block px-2 py-2 rounded hover:bg-slate-800">How it works</a>
            <Link to={ROUTES.PRICING} className="block px-2 py-2 rounded hover:bg-slate-800">Pricing</Link>
            <Link to={ROUTES.CUSTOMER_REWARDS} className="block px-2 py-2 rounded hover:bg-slate-800">Rewards</Link>

            <div className="pt-2 border-t border-slate-800" />

            <Link to={ROUTES.CUSTOMER_BUY_POINTS} className="block px-2 py-2 rounded bg-emerald-500 text-white text-center">Buy Points</Link>

            {!user && (
              <div className="pt-2">
                <Link to={ROUTES.CUSTOMER_LOGIN} className="block px-2 py-2 rounded hover:bg-slate-800">Customer Sign in</Link>
                <Link to={ROUTES.VENDOR_LOGIN} className="block px-2 py-2 rounded hover:bg-slate-800">Vendor Sign in</Link>
                <Link to={ROUTES.CUSTOMER_REGISTER} className="block mt-1 px-2 py-2 rounded bg-white text-slate-900 text-center">Sign up</Link>
              </div>
            )}

            {user && (
              <div className="pt-2 space-y-1">
                <button onClick={() => { goToRoleDashboard(); setMobileOpen(false); }} className="block w-full text-left px-2 py-2 rounded hover:bg-slate-800">Dashboard</button>
                <Link to="/customer/profile" className="block px-2 py-2 rounded hover:bg-slate-800">Profile</Link>

                {user.role === "vendor" && <Link to={ROUTES.VENDOR_UPLOAD} className="block px-2 py-2 rounded hover:bg-slate-800">Upload service</Link>}
                <button onClick={handleLogout} className="w-full text-left px-2 py-2 rounded hover:bg-slate-800">Sign out</button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
