import  { type ReactNode } from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

type Props = {
  // children: ReactNode;
  title?: string;
  subtitle?: string;
  headerActions?: ReactNode;
};

export default function MainLayout({ title, subtitle, headerActions }: Props) {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      <Navbar />
      <header className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            {title ? <h1 className="text-2xl font-bold">{title}</h1> : null}
            {subtitle ? <p className="text-sm text-slate-300 mt-1">{subtitle}</p> : null}
          </div>

          {headerActions ? (
            <div className="flex items-center gap-3">
              {headerActions}
            </div>
          ) : null}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-6 shadow-inner">
          <Outlet />
        </div>
      </main>

      <footer className="mt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-sm text-slate-400">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>© {new Date().getFullYear()} CollectoVault. All rights reserved.</div>
            <div className="flex gap-4">
              <a href="/terms" className="hover:underline">Terms</a>
              <a href="/privacy" className="hover:underline">Privacy</a>
              <a href="/contact" className="hover:underline">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
