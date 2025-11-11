// src/features/common/NavBar.tsx
import type { JSX } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useSession from "../../hooks/useSession";
import ROUTES from "../../constants/routes";

/**
 * Clean responsive navbar optimized for mobile + desktop.
 * Shows user avatar / name / points and a compact menu.
 */
export default function NavBar(): JSX.Element {
  const [open, setOpen] = useState(false);
  const { user, loading, logout } = useSession();
  const navigate = useNavigate();

  const onSignOut = async () => {
    try {
      await logout();
    } catch (e) { /* ignore */ }
    navigate(ROUTES.ROOT ?? "/");
  };

  return (
    <header className="bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* left */}
          <div className="flex items-center gap-3">
            <Link to={ROUTES.ROOT ?? "/"} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-linear-to-br from-emerald-500 to-teal-400 flex items-center justify-center shadow">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="white" />
                </svg>
              </div>
              <div className="hidden sm:block">
                <div className="text-lg font-semibold">CollectoVault</div>
                <div className="text-xs text-slate-300 -mt-1">Power your loyalty</div>
              </div>
            </Link>
          </div>

          {/* center nav (desktop) */}
          <nav className="hidden md:flex md:items-center md:space-x-6 text-sm">
            <Link to={ROUTES.CUSTOMER.VENDORSTOREFRONT ?? "/vendor"} className="hover:underline">Services</Link>
            <Link to={ROUTES.CUSTOMER.REWARDS ?? "/customer/rewards"} className="hover:underline">Rewards</Link>
            <Link to={ROUTES.CUSTOMER.TRANSACTIONS ?? "/customer/transactions"} className="hover:underline">Transactions</Link>
            <Link to={ROUTES.PRICING ?? "/pricing"} className="hover:underline">Pricing</Link>
          </nav>

          {/* right */}
          <div className="flex items-center gap-3">
            <Link to={ROUTES.CUSTOMER.BUYPOINTS ?? "/buy-points"} className="hidden sm:inline-block px-3 py-1.5 rounded-md bg-white text-slate-900 text-sm font-semibold shadow-sm hover:brightness-95">
              Buy points
            </Link>

            {!loading && !user && (
              <div className="hidden sm:flex items-center gap-2">
                <Link to={ROUTES.REGISTER ?? "/register"} className="px-3 py-1.5 rounded-md bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600">Sign up</Link>
                <Link to={ROUTES.LOGIN ?? "/login"} className="px-3 py-1.5 rounded-md border border-slate-700 text-sm">Sign in</Link>
              </div>
            )}

            {!loading && user && (
              <div className="relative">
                <button
                  onClick={() => setOpen(v => !v)}
                  className="flex items-center gap-3 p-1 rounded-md hover:bg-slate-800"
                >
                  <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-white text-sm font-semibold overflow-hidden">
                    {user.avatarUrl ? <img src={user.avatarUrl} alt={user.name ?? "avatar"} className="w-full h-full object-cover" /> : (user.name || user.email || "U").charAt(0)}
                  </div>
                  <div className="hidden sm:flex sm:flex-col text-left">
                    <span className="text-sm font-medium leading-none">{user.name ?? user.username ?? user.email}</span>
                    <span className="text-xs text-slate-400 leading-none">Balance: <span className="font-semibold text-white">{Number(user.points ?? 0).toLocaleString()} pts</span></span>
                  </div>
                  <svg className="w-4 h-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                  </svg>
                </button>

                {open && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-800 rounded-md p-2 shadow-lg z-50">
                    <Link to={ROUTES.CUSTOMER.DASHBOARD ?? "/customer/dashboard"} className="block px-3 py-2 rounded hover:bg-slate-700">Dashboard</Link>
                    <Link to="/customer/profile" className="block px-3 py-2 rounded hover:bg-slate-700">Profile</Link>
                    <Link to={ROUTES.CUSTOMER.TRANSACTIONS ?? "/customer/transactions"} className="block px-3 py-2 rounded hover:bg-slate-700">Transactions</Link>
                    <div className="border-t border-slate-700 my-1" />
                    <button onClick={onSignOut} className="w-full text-left px-3 py-2 rounded hover:bg-slate-700">Sign out</button>
                  </div>
                )}
              </div>
            )}

            {/* mobile menu toggle */}
            <div className="md:hidden">
              <button onClick={() => setOpen(v => !v)} className="p-2 rounded-md hover:bg-slate-800">
                {!open ? (
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                ) : (
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* mobile menu */}
      {open && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900/95">
          <div className="px-4 pt-4 pb-6 space-y-3">
            <Link to={ROUTES.ROOT ?? "/"} className="block px-3 py-2 rounded hover:bg-slate-800">Home</Link>
            <Link to={ROUTES.CUSTOMER.VENDORSTOREFRONT ?? "/vendor"} className="block px-3 py-2 rounded hover:bg-slate-800">Services</Link>
            <Link to={ROUTES.CUSTOMER.REWARDS ?? "/customer/rewards"} className="block px-3 py-2 rounded hover:bg-slate-800">Rewards</Link>
            <Link to={ROUTES.CUSTOMER.TRANSACTIONS ?? "/customer/transactions"} className="block px-3 py-2 rounded hover:bg-slate-800">Transactions</Link>
            <div className="pt-2 border-t border-slate-800" />
            <Link to={ROUTES.CUSTOMER.BUYPOINTS ?? "/buy-points"} className="block px-2 py-2 rounded bg-emerald-500 text-white text-center">Buy points</Link>
            {!user && (
              <>
                <Link to={ROUTES.LOGIN ?? "/login"} className="block px-2 py-2 rounded hover:bg-slate-800">Sign in</Link>
                <Link to={ROUTES.REGISTER ?? "/register"} className="block px-2 py-2 rounded bg-white text-slate-900 text-center">Sign up</Link>
              </>
            )}
            {user && <button onClick={onSignOut} className="w-full text-left px-2 py-2 rounded hover:bg-slate-800">Sign out</button>}
          </div>
        </div>
      )}
    </header>
  );
}
