// src/components/layout/MainLayout.tsx
import  { type ReactNode, type JSX } from "react";
import { Outlet } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import Navbar from "./Navbar";

type Props = {
  title?: string;
  subtitle?: string;
  headerActions?: ReactNode;
};

const headerMotion: Variants = {
  hidden: { opacity: 0, y: -6 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

const contentMotion: Variants = {
  hidden: { opacity: 0, y: 8, scale: 0.998 },
  enter: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, delay: 0.08 } },
};

export default function MainLayout({ title, subtitle, headerActions }: Props): JSX.Element {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 text-white antialiased">
      
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:bg-slate-900 focus:text-white focus:px-3 focus:py-2 rounded-md z-50"
      >
        Skip to content
      </a>

      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute right-[-10%] top-0 w-[60vw] h-full bg-linear-to-br from-emerald-600/5 to-teal-500/4 blur-3xl opacity-30 transform-gpu" />
      </div>

      <Navbar />

      <motion.header
        variants={headerMotion}
        initial="hidden"
        animate="enter"
        className="sticky top-0 z-40 backdrop-blur-sm bg-slate-900/40 border-b border-slate-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            {title ? (
              <motion.h1 initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0, transition: { duration: 0.35 } }} className="text-xl sm:text-2xl font-extrabold leading-tight">
                {title}
              </motion.h1>
            ) : null}
            {subtitle ? (
              <motion.p initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0, transition: { duration: 0.35, delay: 0.04 } }} className="text-sm text-slate-300 mt-1 max-w-2xl">
                {subtitle}
              </motion.p>
            ) : null}
          </div>

          {headerActions ? (
            <motion.div initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0, transition: { duration: 0.35, delay: 0.06 } }} className="flex items-center gap-3">
              {headerActions}
            </motion.div>
          ) : (
            <div className="hidden sm:block" />
          )}
        </div>
      </motion.header>

      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.section variants={contentMotion} initial="hidden" animate="enter" className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-inner" aria-live="polite">
          <Outlet />
        </motion.section>
      </main>

      <footer className="mt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-sm text-slate-400">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
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
