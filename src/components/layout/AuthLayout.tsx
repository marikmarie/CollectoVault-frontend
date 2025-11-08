//import { useState } from "react";
import { Link, Outlet } from "react-router-dom";

type Props = {
  title?: string;
  subtitle?: string;
};

export default function AuthLayout({ title = "Welcome", subtitle }: Props) {
  // const [role, setRole] = useState<"customer" | "vendor">("customer");
  // const navigate = useNavigate();

  // const handleSwitchRole = (newRole: "customer" | "vendor") => {
  //   setRole(newRole);
  //   navigate(newRole === "vendor" ? "/vendor/login" : "/login");
  // };

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-slate-800 via-slate-800 to-slate-800 text-white flex items-center justify-center">

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-[200%] h-full opacity-30 bg-[radial-gradient(ellipse_at_center,rgba(0,255,200,0.1),transparent_50%)] animate-[pulse_6s_infinite]" />
        <div className="absolute -top-32 -left-32 w-[160%] h-[160%] bg-[conic-gradient(from_90deg_at_50%_50%,rgba(0,150,255,0.08),transparent_60%)] animate-[spin_60s_linear_infinite]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* LEFT PANEL */}
          <aside className="hidden lg:flex flex-col gap-6 bg-slate-800/30 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-linear-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                    fill="white"
                  />
                </svg>
              </div>
              <div>
                <div className="text-xl font-bold">CollectoVault</div>
                <div className="text-xs text-slate-300">Power your loyalty</div>
              </div>
            </div>

            <div className="bg-slate-900/40 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Your Loyalty Snapshot</h3>
              <div className="bg-slate-800/60 p-4 rounded-lg">
                <div className="text-4xl font-extrabold">1,240</div>
                <div className="text-sm text-slate-300">Points</div>
                <div className="mt-3 text-sm text-slate-400">
                  Silver Tier • 45% to Gold
                </div>
                <div className="w-full bg-slate-700 h-2 rounded-full mt-3">
                  <div
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: "45%" }}
                  />
                </div>
              </div>
            </div>

            <div className="text-sm text-slate-300 leading-relaxed">
              <p>
                <strong>Why join CollectoVault?</strong>
              </p>
              <ul className="mt-2 space-y-2 list-disc pl-5 text-slate-400">
                <li>Earn points from multiple vendors.</li>
                <li>Redeem instantly for rewards.</li>
                <li>Get exclusive loyalty offers.</li>
              </ul>
            </div>

            <div className="mt-auto">
              <Link to="/how-it-works" className="text-sm underline hover:text-emerald-400 transition">
                Learn how CollectoVault works
              </Link>
            </div>
          </aside>

          {/* RIGHT PANEL */}
          <div className="bg-slate-800/70 backdrop-blur-md rounded-xl p-8 shadow-2xl border border-slate-700/50">
            <header className="mb-4 text-center">
              <h2 className="text-3xl font-bold bg-linear-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                {title}
              </h2>
              {subtitle && (
                <p className="text-sm text-slate-300 mt-1">{subtitle}</p>
              )}
            </header>

{/*             
            <div className="flex justify-center mb-6">
              <div className="inline-flex bg-slate-900/50 border border-slate-700 rounded-full p-1">
                <button
                  onClick={() => handleSwitchRole("customer")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    role === "customer"
                      ? "bg-emerald-500 text-white shadow"
                      : "text-slate-400 hover:text-emerald-300"
                  }`}
                >
                  Customer
                </button>
                <button
                  onClick={() => handleSwitchRole("vendor")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    role === "vendor"
                      ? "bg-emerald-500 text-white shadow"
                      : "text-slate-400 hover:text-emerald-300"
                  }`}
                >
                  Vendor
                </button>
              </div>
            </div> */}

            <Outlet />

            <div className="mt-8 text-sm text-slate-400 text-center">
              By continuing, you agree to our{" "}
              <Link to="/terms" className="underline hover:text-emerald-400 transition">
                Terms
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="underline hover:text-emerald-400 transition">
                Privacy
              </Link>
              .
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
