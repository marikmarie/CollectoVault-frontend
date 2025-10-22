import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// const Avatar: React.FC<{ name?: string; size?: number }> = ({
//   name = "User",
//   size = 10,
// }) => {
//   const initials = name
//     .split(" ")
//     .map((n) => n[0])
//     .slice(0, 2)
//     .join("")
//     .toUpperCase();

//   return (
//     <div
//       className={`w-${size} h-${size} rounded-full bg-linear-to-br from-green-500 to-teal-400 flex items-center justify-center font-bold text-sm text-white`}
//       aria-hidden
//     >
//       {initials}
//     </div>
//   );
// };

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

  // close menus on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="w-full bg-slate-900/60 backdrop-blur-md border-b border-slate-800">
      <nav className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 rounded"
          >
            <div className="w-10 h-10 rounded-lg bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center font-extrabold text-white">
              CV
            </div>
            <div className="hidden md:block">
              <div className="text-white font-semibold text-lg">
                CollectoVault
              </div>
              <div className="text-xs text-slate-400">Power your loyalty</div>
            </div>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="text-slate-300 hover:text-white transition"
          >
            Home
          </Link>
          <Link
            to="/services"
            className="text-slate-300 hover:text-white transition"
          >
            Services
          </Link>
          <Link
            to="/pricing"
            className="text-slate-300 hover:text-white transition"
          >
            See Rewards
          </Link>
          <Link
            to="/"
            className="text-slate-300 hover:text-white transition"
          >
            CollectoVault
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {/* Primary CTA */}
          {!user && (
            <Link
              to="/customer/register"
              className="hidden md:inline-block px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium shadow"
            >
              Get Started
            </Link>
          )}

          {/* Auth links / profile */}
          {!user ? (
            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/customer/login"
                className="text-slate-300 hover:text-white"
              >
                Customer
              </Link>
              <Link
                to="/staff/login"
                className="text-slate-300 hover:text-white"
              >
                Staff
              </Link>
            </div>
          ) : (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen((s) => !s)}
                aria-expanded={profileOpen}
                aria-haspopup="true"
                className="inline-flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 rounded"
                title="Open profile menu"
              >
                <div className="text-slate-300 text-sm hidden md:block">
                  Hello,{" "}
                  <span className="text-white font-semibold">
                    {user.name ?? user.firstName ?? "Member"}
                  </span>
                </div>
                <div className="md:ml-0">
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-white font-medium">
                    {(user.name || user.firstName || "U")
                      .toString()
                      .slice(0, 1)
                      .toUpperCase()}
                  </div>
                </div>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-3 w-44 bg-slate-800 rounded-md shadow-lg border border-slate-700 overflow-hidden z-50">
                
                  <button
                    onClick={() => logout()}
                    className="w-full text-left px-4 py-2 text-sm text-rose-400 hover:bg-slate-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => setMobileOpen((s) => !s)}
            className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {/* hamburger / close */}
            <svg
              className="w-6 h-6 text-slate-200"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {mobileOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="md:hidden bg-slate-900/95 border-t border-slate-800">
          <div className="px-4 py-4 space-y-3">
            <Link
              to="/rewards"
              onClick={() => setMobileOpen(false)}
              className="block text-slate-300"
            >
              Rewards
            </Link>
            <Link
              to="/features"
              onClick={() => setMobileOpen(false)}
              className="block text-slate-300"
            >
              Features
            </Link>
            <Link
              to="/pricing"
              onClick={() => setMobileOpen(false)}
              className="block text-slate-300"
            >
              Pricing
            </Link>
            <Link
              to="/docs"
              onClick={() => setMobileOpen(false)}
              className="block text-slate-300"
            >
              Docs
            </Link>

            <div className="pt-2 border-t border-slate-800" />

            {!user ? (
              <>
                <Link
                  to="/customer/login"
                  onClick={() => setMobileOpen(false)}
                  className="block text-slate-200"
                >
                  Customer Login
                </Link>
                <Link
                  to="/staff/login"
                  onClick={() => setMobileOpen(false)}
                  className="block text-slate-200"
                >
                  Staff Login
                </Link>
                <Link
                  to="/customer/register"
                  onClick={() => setMobileOpen(false)}
                  className="block mt-2 px-3 py-2 bg-green-500 text-white rounded"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    logout();
                  }}
                  className="w-full text-left mt-1 px-3 py-2 text-rose-400"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
