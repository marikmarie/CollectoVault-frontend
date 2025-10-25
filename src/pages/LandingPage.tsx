// src/pages/LandingPage.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import RewardCard from "../components/common/RewardCard";
import Button from "../components/common/Button";
import ROUTES from "../constants/routes";

const sampleRewards = [
  {
    id: "r1",
    title: "2-Hour Spa Voucher",
    description: "Relax and rejuvenate with a signature spa session at Forest Park Resort.",
    pointsPrice: 1200,
    currencyPrice: 15,
    vendorName: "Forest Park Spa",
    imageUrl: "/assets/images/spa.jpg",
    tags: ["Popular"],
  },
  {
    id: "r2",
    title: "Dinner for Two",
    description: "Three-course dining experience with complimentary dessert.",
    pointsPrice: 800,
    currencyPrice: 10,
    vendorName: "Lakeview Restaurant",
    imageUrl: "/assets/images/dinner.jpg",
    tags: ["Bestseller"],
  },
  {
    id: "r3",
    title: "Room Upgrade",
    description: "Upgrade to a premium room on weekday stays (subject to availability).",
    pointsPrice: 2000,
    currencyPrice: 25,
    vendorName: "Forest Park Resort",
    imageUrl: "/assets/images/room.jpg",
    tags: ["Limited"],
  },
];

const sampleVendors = [
  { id: "v1", name: "Forest Park Resort", logo: "/assets/images/vendor-forestpark.png" },
  { id: "v2", name: "Forest Mall", logo: "/assets/images/vendor-forestmall.png" },
  { id: "v3", name: "Lakeview Restaurant", logo: "/assets/images/vendor-lakeview.png" },
];

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-700 text-white">
      <Navbar />

      {/* Background decorative SVG */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10">
        <svg className="w-[140%] h-full -translate-x-8 opacity-20" viewBox="0 0 1600 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <defs>
            <linearGradient id="g2" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
            <filter id="blurGlow2" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="12" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g stroke="url(#g2)" strokeWidth="2.2" fill="none" strokeLinecap="round" filter="url(#blurGlow2)">
            <path d="M0 280 C300 180 600 180 900 280 S1500 380 1600 280" opacity="0.12" />
            <path d="M0 320 C250 220 550 220 900 320 S1500 420 1600 320" opacity="0.10" />
          </g>
        </svg>
      </div>

      <main className="relative max-w-7xl mx-auto px-6 py-20">
        {/* HERO */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              CollectoVault — <span className="bg-clip-text text-transparent bg-linear-to-r from-emerald-300 to-emerald-500">Power your loyalty</span>
            </h1>
            <p className="text-lg text-slate-300 max-w-xl">
              Elegant, modern loyalty management for hotels, retailers and service providers. Award points, create tiers, let customers redeem instantly across merchants — all from a beautiful web dashboard.
            </p>

            <div className="flex flex-wrap gap-4 items-center">
              <Button variant="primary" onClick={() => navigate("/customer/register")}>Get Started — It’s Free</Button>
              <Link to="/customer/login" className="inline-flex items-center px-4 py-2 rounded-md border border-slate-700 hover:bg-slate-800 text-sm">
                Sign in
              </Link>
            </div>

            <div className="mt-2 text-sm text-slate-400">
              Trusted by partners like <span className="font-semibold text-slate-100">Forest Park Resort</span> and <span className="font-semibold text-slate-100">Forest Mall</span>.
            </div>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="text-sm text-slate-300">
                <div className="text-2xl font-bold text-white">1240</div>
                <div className="text-xs text-slate-400">Avg points earned</div>
              </div>
              <div className="text-sm text-slate-300">
                <div className="text-2xl font-bold text-white">3.8x</div>
                <div className="text-xs text-slate-400">Repeat visits</div>
              </div>
              <div className="text-sm text-slate-300">
                <div className="text-2xl font-bold text-white">500+</div>
                <div className="text-xs text-slate-400">Rewards claimed</div>
              </div>
              <div className="text-sm text-slate-300">
                <div className="text-2xl font-bold text-white">99%</div>
                <div className="text-xs text-slate-400">Uptime (demo)</div>
              </div>
            </div>
          </div>

          {/* Hero preview card */}
          <aside className="bg-white/5 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs text-slate-300">Member preview</div>
                <div className="text-2xl font-bold">1240 pts</div>
                <div className="text-sm text-slate-400 mt-1">Silver • 45% to Gold</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400">Tier</div>
                <div className="text-sm font-semibold bg-slate-800 px-2 py-1 rounded">Silver</div>
              </div>
            </div>

            <div className="w-full h-48 rounded-md overflow-hidden bg-slate-900/30 flex items-center justify-center">
              {/* Video or screenshot preview */}
              <div className="text-center text-slate-400">
                <div className="mb-2">Dashboard preview</div>
                <div className="text-xs">Interactive, mobile-friendly UI</div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button className="px-3 py-2 bg-emerald-500 rounded text-sm font-semibold">Redeem</button>
              <button className="px-3 py-2 border border-slate-700 rounded text-sm">View history</button>
            </div>
          </aside>
        </section>

        {/* FEATURES */}
        <section className="mt-20">
          <h2 className="text-2xl font-bold text-center">How CollectoVault helps your business</h2>
          <p className="text-center text-slate-400 mt-2 max-w-2xl mx-auto">A complete loyalty platform that works for hotels, malls, restaurants and any service provider. Flexible rules, clear analytics, and delightful experiences for customers.</p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-6">
              <div className="text-emerald-400 mb-2 font-semibold">Earn & Track</div>
              <h3 className="font-semibold text-lg">Points that grow retention</h3>
              <p className="text-slate-300 mt-2 text-sm">Award points per purchase or action. Visualize balances and transaction history in a single place.</p>
            </div>

            <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-6">
              <div className="text-emerald-400 mb-2 font-semibold">Redeem Anywhere</div>
              <h3 className="font-semibold text-lg">Cross-vendor redemptions</h3>
              <p className="text-slate-300 mt-2 text-sm">Customers spend points across vendors like hotels, restaurants and retail — perfect for cross-promotion.</p>
            </div>

            <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-6">
              <div className="text-emerald-400 mb-2 font-semibold">Tiers & Rewards</div>
              <h3 className="font-semibold text-lg">Gamified loyalty</h3>
              <p className="text-slate-300 mt-2 text-sm">Create Bronze→Silver→Gold tiers with custom perks and progress tracking to encourage repeat business.</p>
            </div>
          </div>
        </section>

        {/* Rewards preview */}
        <section className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Featured rewards</h2>
            <Link to="/customer/rewards" className="text-sm text-slate-300 underline">View all rewards</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleRewards.map((r) => (
              <RewardCard
                key={r.id}
                id={r.id}
                title={r.title}
                description={r.description}
                pointsPrice={r.pointsPrice ?? null}
                currencyPrice={r.currencyPrice ?? null}
                vendorName={r.vendorName}
                imageUrl={r.imageUrl}
                tags={r.tags}
              />
            ))}
          </div>
        </section>

        {/* Vendors */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-4">Our partners</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 items-center">
            {sampleVendors.map((v) => (
              <div key={v.id} className="flex items-center gap-3 p-3 bg-slate-900/20 rounded">
                <div className="w-12 h-12 rounded bg-white/5 flex items-center justify-center overflow-hidden">
                  {/* vendor logo placeholder */}
                  <img src={v.logo} alt={v.name} className="w-full h-full object-contain" />
                </div>
                <div className="hidden sm:block text-sm text-slate-300">{v.name}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-center">What our partners say</h2>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-6">
              <p className="text-slate-300 italic">"CollectoVault helped us increase repeat bookings by 28% in only two months. Setup was smooth and customer support is excellent."</p>
              <div className="mt-4 text-sm text-slate-400">— Samson Johnson, Forest Park Resort</div>
            </div>
            <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-6">
              <p className="text-slate-300 italic">"Our customers love redeeming points for dining and spa packages. Integration with our POS was straightforward."</p>
              <div className="mt-4 text-sm text-slate-400">— TM, Four points Restaurant</div>
            </div>
            <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-6">
              <p className="text-slate-300 italic">"The tier system motivated customers to aim for Gold — average spend increased noticeably."</p>
              <div className="mt-4 text-sm text-slate-400">— Mariam, Forest Mall</div>
            </div>
          </div>
        </section>

        {/* Pricing / CTA */}
        <section className="mt-16 bg-slate-900/20 border border-slate-800 rounded-lg p-8">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            <div className="md:col-span-2">
              <h3 className="text-xl font-semibold">Simple pricing to get started</h3>
              <p className="text-slate-300 mt-2">Flexible plans for small businesses and enterprise partners. Start with the demo, then scale with our API for payments and integrations.</p>
            </div>

            <div className="flex flex-col items-end gap-3">
              <div className="text-sm text-slate-300">Want a tailored demo?</div>
              <div className="flex gap-3">
                <Button variant="primary" onClick={() => navigate("/customer/register")}>Request demo</Button>
                <Link to="/pricing" className="px-3 py-2 rounded border border-slate-700 text-sm">See plans</Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 pb-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-lg font-bold">CollectoVault</div>
                <div className="text-sm text-slate-400 mt-2">Power your loyalty — beautiful, reliable, and easy to integrate.</div>
              </div>

              <div className="flex gap-6">
                <div>
                  <div className="font-semibold mb-2">Product</div>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li><Link to="/how-it-works" className="hover:underline">How it works</Link></li>
                    <li><Link to="/customer/rewards" className="hover:underline">Rewards</Link></li>
                    <li><Link to="/pricing" className="hover:underline">Pricing</Link></li>
                  </ul>
                </div>

                <div>
                  <div className="font-semibold mb-2">Company</div>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li><Link to="/terms" className="hover:underline">Terms</Link></li>
                    <li><Link to="/privacy" className="hover:underline">Privacy</Link></li>
                    <li><a href="mailto:hello@collectovault.com" className="hover:underline">Contact</a></li>
                  </ul>
                </div>
              </div>

              <div className="text-sm text-slate-300">
                <div className="font-semibold mb-2">Get started</div>
                <div className="flex gap-3">
                  <Button variant="secondary" onClick={() => navigate("/customer/register")}>Sign up</Button>
                  <Link to={ROUTES.LOGIN} className="px-3 py-2 rounded border border-slate-700 text-sm">Sign in</Link>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center text-xs text-slate-500">
              © {new Date().getFullYear()} CollectoVault. All rights reserved.
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default LandingPage;
