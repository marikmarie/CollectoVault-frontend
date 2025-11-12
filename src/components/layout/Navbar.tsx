// src/features/common/NavBar.tsx
import type { JSX } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useSession from "../../hooks/useSession";
import ROUTES from "../../constants/routes";

export default function NavBar(): JSX.Element {
  const [open, setOpen] = useState(false);
  const { user, loaded, logout } = useSession();
  const navigate = useNavigate();

  async function onSignOut() {
    await logout();
    navigate(ROUTES.ROOT ?? "/");
  }

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center h-16">

        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-white shadow">
            C
          </div>
          <span className="hidden sm:block font-semibold text-lg">CollectoVault</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link to="/" className="hover:text-emerald-400">Home</Link>
          <Link to={ROUTES.CUSTOMER.VENDORSTOREFRONT} className="hover:text-emerald-400">Services</Link>
          <Link to={ROUTES.CUSTOMER.REWARDS} className="hover:text-emerald-400">Rewards</Link>
          <Link to={ROUTES.CUSTOMER.TRANSACTIONS} className="hover:text-emerald-400">Transactions</Link>
          <Link to={ROUTES.PRICING} className="hover:text-emerald-400">Pricing</Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link to={ROUTES.CUSTOMER.BUYPOINTS} className="hidden sm:inline-block px-3 py-1.5 rounded bg-white text-slate-900 text-sm font-semibold">
            Buy Points
          </Link>

          {!loaded ? null : !user ? (
            <div className="hidden sm:flex gap-3">
              <Link to={ROUTES.LOGIN} className="px-3 py-1.5 border border-slate-700 rounded">Sign in</Link>
              <Link to={ROUTES.REGISTER} className="px-3 py-1.5 rounded bg-emerald-500 text-white">Sign up</Link>
            </div>
          ) : (
            <div className="relative">
              <button onClick={() => setOpen(o => !o)} className="flex items-center gap-2">
                <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-xs font-semibold">
                  {(user.name ?? user.email ?? "U")[0]}
                </div>
                <span className="hidden sm:inline text-sm">{user.name ?? user.email}</span>
              </button>

              {open && (
                <div className="absolute right-0 mt-2 bg-slate-800 rounded-md p-2 w-48 shadow-lg text-sm">
                  <Link to={ROUTES.CUSTOMER.DASHBOARD} className="block px-3 py-2 rounded hover:bg-slate-700">Dashboard</Link>
                  <Link to={ROUTES.CUSTOMER.TRANSACTIONS} className="block px-3 py-2 rounded hover:bg-slate-700">Transactions</Link>
                  <button onClick={onSignOut} className="w-full text-left px-3 py-2 rounded hover:bg-slate-700">Sign out</button>
                </div>
              )}
            </div>
          )}

          <button className="md:hidden p-2" onClick={() => setOpen(o => !o)}>
            ☰
          </button>
        </div>
      </div>
    </header>
  );
}
