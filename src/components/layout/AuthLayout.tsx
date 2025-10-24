import React, { type ReactNode } from "react";
import { Link } from "react-router-dom";

type Props = {
  children: ReactNode;
  title?: string;
  subtitle?: string;
};

/**
 * AuthLayout: centered card for authentication (login/register)
 * Use for pages like /customer/login, /customer/register
 */
export default function AuthLayout({ children, title = "Welcome", subtitle }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-700 text-white flex items-center">
      <div className="max-w-6xl mx-auto px-6 py-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left: marketing / preview */}
          <aside className="hidden lg:flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="white" />
                </svg>
              </div>
              <div>
                <div className="text-lg font-bold">CollectoVault</div>
                <div className="text-xs text-slate-300">Power your loyalty</div>
              </div>
            </div>

            <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">Member Snapshot</h3>
              <div className="bg-slate-900/30 p-4 rounded">
                <div className="text-4xl font-extrabold">1,240</div>
                <div className="text-sm text-slate-300">Points</div>
                <div className="mt-3 text-sm text-slate-400">Silver • 45% to Gold</div>
                <div className="w-full bg-slate-700 h-2 rounded-full mt-3">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: "45%" }} />
                </div>
              </div>
            </div>

            <div className="text-sm text-slate-300">
              <p><strong>Why join?</strong></p>
              <ul className="mt-2 space-y-2 list-disc pl-5 text-slate-400">
                <li>Earn points at many merchants</li>
                <li>Redeem instantly online</li>
                <li>Exclusive discounts and offers</li>
              </ul>
            </div>

            <div className="mt-auto">
              <Link to="/how-it-works" className="text-sm underline">Learn how CollectoVault works</Link>
            </div>
          </aside>

          {/* Right: auth card */}
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-8 shadow-lg">
            <header className="mb-4">
              <h2 className="text-2xl font-bold">{title}</h2>
              {subtitle && <p className="text-sm text-slate-300 mt-1">{subtitle}</p>}
            </header>

            <div>
              {children}
            </div>

            <div className="mt-6 text-sm text-slate-400 text-center">
              By continuing you agree to our <Link to="/terms" className="underline">Terms</Link> and <Link to="/privacy" className="underline">Privacy</Link>.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
