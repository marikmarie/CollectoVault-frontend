import React from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import RewardCard from "../components/common/RewardCard";
import Button from "../components/common/Button";
import ROUTES from "../constants/routes";

const sampleRewards = [
  {
    id: "r1",
    title: "2-Hour Spa Voucher",
    description:
      "Relax and rejuvenate with a signature spa session at Forest Park Resort.",
    pointsPrice: 1200,
    currencyPrice: 20000,
    vendorName: "Forest Park Resort",
    imageUrl: "images/spa.png",
    tags: ["Popular"],
  },
  {
    id: "r2",
    title: "Dinner for Two",
    description: "Three-course dining experience with complimentary dessert.",
    pointsPrice: 800,
    currencyPrice: 10000,
    vendorName: "Emperor Hotel",
    imageUrl: "images/dinner.png",
    tags: ["Bestseller"],
  },
  {
    id: "r3",
    title: "Room Upgrade",
    description:
      "Upgrade to a premium room on weekday stays (subject to availability).",
    pointsPrice: 2000,
    currencyPrice: 25000,
    vendorName: "Forest Park Resort",
    imageUrl: "images/room.png",
    tags: ["Limited"],
  },
];

const sampleVendors = [
  {
    id: "v1",
    name: "Forest Park Resort",
    logo: "/assets/images/vendor-forestpark.png",
  },
  {
    id: "v2",
    name: "Forest Mall",
    logo: "/assets/images/vendor-forestmall.png",
  },
  {
    id: "v3",
    name: "Emperor Restaurant",
    logo: "/assets/images/vendor-lakeview.png",
  },
];

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-700 text-white">
     <Navbar />


<div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
  <div className="absolute top-0 left-0 w-[200%] h-full opacity-30 bg-[radial-gradient(ellipse_at_center,rgba(0,255,200,0.1),transparent_50%)] animate-[pulse_6s_infinite]" />
  <div className="absolute -top-32 -left-32 w-[160%] h-[160%] bg-[conic-gradient(from_90deg_at_50%_50%,rgba(0,150,255,0.08),transparent_60%)] animate-[spin_60s_linear_infinite]" />
</div>
  
      <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10">
        <svg
          className="w-[140%] h-full -translate-x-8 opacity-20"
          viewBox="0 0 1600 600"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
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

          <g
            stroke="url(#g2)"
            strokeWidth="2.2"
            fill="none"
            strokeLinecap="round"
            filter="url(#blurGlow2)"
          >
            <path
              d="M0 280 C300 180 600 180 900 280 S1500 380 1600 280"
              opacity="0.12"
            />
            <path
              d="M0 320 C250 220 550 220 900 320 S1500 420 1600 320"
              opacity="0.10"
            />
          </g>
        </svg>
      </div>

      <main className="relative max-w-7xl mx-auto px-6 py-20">
        {/* HERO */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-4xl md:text-5xl font-extrabold leading-tight"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              CollectoVault —{" "}
              <span className="bg-clip-text text-transparent bg-linear-to-r from-emerald-300 to-emerald-500">
                Power your loyalty
              </span>
            </motion.h1>
            <motion.p
              className="text-lg text-slate-300 max-w-xl"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Elegant, modern loyalty management for hotels, retailers and
              service providers. Award points, create tiers, let customers
              redeem instantly across merchants — all from a beautiful web
              dashboard.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4 items-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                variant="primary"
                className="transform transition ease-out duration-300 hover:scale-105"
                onClick={() => navigate("/register")}
              >
                Get Started — It’s Free
              </Button>
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 rounded-md border border-slate-700 hover:bg-slate-800 text-sm transform transition ease-out duration-300 hover:scale-105"
              >
                Sign in
              </Link>
            </motion.div>

            <motion.div
              className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
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
                <div className="text-xs text-slate-400">Uptime</div>
              </div>
            </motion.div>
          </motion.div>

          <motion.aside
            className="bg-white/5 backdrop-blur-sm rounded-xl p-6 shadow-lg"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs text-slate-300">Member preview</div>
                <div className="text-2xl font-bold">1240 pts</div>
                <div className="text-sm text-slate-400 mt-1">
                  Silver • 45% to Gold
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400">Tier</div>
                <div className="text-sm font-semibold bg-slate-800 px-2 py-1 rounded">
                  Silver
                </div>
              </div>
            </div>
    
            <div className="w-full h-48 rounded-md overflow-hidden bg-slate-900/30 flex items-center justify-center shadow-lg border border-slate-700/50">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/T-F-vVNVQ50?autoplay=1&mute=1&loop=1&playlist=T-F-vVNVQ50&controls=0&modestbranding=1&rel=0"
                title="CollectoVault Dashboard Preview"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button className="px-3 py-2 bg-emerald-500 rounded text-sm font-semibold hover:bg-emerald-600 transform transition ease-out duration-300 hover:scale-105">
                Redeem
              </button>
              <button className="px-3 py-2 border border-slate-700 rounded text-sm hover:bg-slate-700 transform transition ease-out duration-300 hover:scale-105">
                View history
              </button>
            </div>
          </motion.aside>
        </section>

        {/* FEATURES */}
        <section id="how-it-works" className="mt-20 scroll-mt-24">
          <motion.h2
            className="text-2xl font-bold text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            How CollectoVault helps your business
          </motion.h2>
          <motion.p
            className="text-center text-slate-400 mt-2 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            A complete loyalty platform that works for hotels, malls,
            restaurants and any service provider. Flexible rules, clear
            analytics, and delightful experiences for customers.
          </motion.p>

          <motion.div
            className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-6 hover:bg-slate-900/50 transition-colors">
              <div className="text-emerald-400 mb-2 font-semibold">
                Earn & Track
              </div>
              <h3 className="font-semibold text-lg">
                Points that grow retention
              </h3>
              <p className="text-slate-300 mt-2 text-sm">
                Award points per purchase or action. Visualize balances and
                transaction history in a single place.
              </p>
            </div>

            <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-6 hover:bg-slate-900/50 transition-colors">
              <div className="text-emerald-400 mb-2 font-semibold">
                Redeem Anywhere
              </div>
              <h3 className="font-semibold text-lg">
                Cross-business redemptions
              </h3>
              <p className="text-slate-300 mt-2 text-sm">
                Customers spend points across businesses like hotels,
                restaurants and retail — perfect for cross-promotion.
              </p>
            </div>

            <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-6 hover:bg-slate-900/50 transition-colors">
              <div className="text-emerald-400 mb-2 font-semibold">
                Tiers & Rewards
              </div>
              <h3 className="font-semibold text-lg">Gamified loyalty</h3>
              <p className="text-slate-300 mt-2 text-sm">
                Create Bronze→Silver→Gold tiers with custom perks and progress
                tracking to encourage repeat business.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Rewards preview */}
        <motion.section
          className="mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <motion.div
            className="flex items-center justify-between mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.h2 className="text-2xl font-bold">
              Featured rewards
            </motion.h2>
            <Link
              to="/customer/rewards"
              className="text-sm text-slate-300 underline"
            >
              View all rewards
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleRewards.map((r) => (
              <motion.div
                key={r.id}
                className="hover:shadow-lg rounded transition-transform"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.03 }}
              >
                <RewardCard
                  id={r.id}
                  title={r.title}
                  description={r.description}
                  pointsPrice={r.pointsPrice ?? null}
                  currencyPrice={r.currencyPrice ?? null}
                  vendorName={r.vendorName}
                  imageUrl={r.imageUrl}
                  tags={r.tags}
                />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Vendors */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-4">Our partners</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 items-center">
            {sampleVendors.map((v) => (
              <motion.div
                key={v.id}
                className="flex items-center gap-3 p-3 bg-slate-900/20 rounded transition-transform"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-12 h-12 rounded bg-white/5 flex items-center justify-center overflow-hidden">
                  <img
                    src={v.logo}
                    alt={v.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="hidden sm:block text-sm text-slate-300">
                  {v.name}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="mt-16">
          <motion.h2
            className="text-2xl font-bold text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            What our partners say
          </motion.h2>
          <motion.div
            className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <motion.div
              className="bg-slate-900/30 border border-slate-800 rounded-lg p-6 hover:bg-slate-900/50 transition-colors"
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-slate-300 italic">
                "CollectoVault helped us increase repeat bookings by 28% in only
                two months. Setup was smooth and customer support is excellent."
              </p>
              <div className="mt-4 text-sm text-slate-400">
                — Samson Johnson, Forest Park Resort
              </div>
            </motion.div>
            <motion.div
              className="bg-slate-900/30 border border-slate-800 rounded-lg p-6 hover:bg-slate-900/50 transition-colors"
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-slate-300 italic">
                "Our customers love redeeming points for dining and spa
                packages. Integration with our POS was straightforward."
              </p>
              <div className="mt-4 text-sm text-slate-400">
                — TM, Four Points Restaurant
              </div>
            </motion.div>
            <motion.div
              className="bg-slate-900/30 border border-slate-800 rounded-lg p-6 hover:bg-slate-900/50 transition-colors"
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-slate-300 italic">
                "The tier system motivated customers to aim for Gold — average
                spend increased noticeably."
              </p>
              <div className="mt-4 text-sm text-slate-400">
                — Mariam, Forest Mall
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Pricing / CTA */}
        <motion.section
          className="mt-16 bg-slate-900/20 border border-slate-800 rounded-lg p-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            <div className="md:col-span-2">
              <h3 className="text-xl font-semibold">
                Simple pricing to get started
              </h3>
              <p className="text-slate-300 mt-2">
                Flexible plans for small businesses and enterprise partners.
                Start with the demo, then scale with our API for payments and
                integrations.
              </p>
            </div>

            <div className="flex flex-col items-end gap-3">
              <div className="text-sm text-slate-300">
                Want a tailored demo?
              </div>
              <div className="flex gap-3">
                <Button
                  variant="primary"
                  className="transform transition ease-out duration-300 hover:scale-105"
                  onClick={() => navigate("/customer/register")}
                >
                  Request demo
                </Button>
                <Link
                  to="/pricing"
                  className="px-3 py-2 rounded border border-slate-700 text-sm transform transition ease-out duration-300 hover:scale-105"
                >
                  See plans
                </Link>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Footer */}
        <footer className="mt-16 pb-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-lg font-bold">CollectoVault</div>
                <div className="text-sm text-slate-400 mt-2">
                  Power your loyalty — beautiful, reliable, and easy to
                  integrate.
                </div>
              </div>

              <div className="flex gap-6">
                <div>
                  <div className="font-semibold mb-2">Product</div>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li>
                      <Link to="/how-it-works" className="hover:underline">
                        How it works
                      </Link>
                    </li>
                    <li>
                      <Link to="/customer/rewards" className="hover:underline">
                        Rewards
                      </Link>
                    </li>
                    <li>
                      <Link to="/pricing" className="hover:underline">
                        Pricing
                      </Link>
                    </li>
                  </ul>
                </div>

                <div>
                  <div className="font-semibold mb-2">Company</div>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li>
                      <Link to="/terms" className="hover:underline">
                        Terms
                      </Link>
                    </li>
                    <li>
                      <Link to="/privacy" className="hover:underline">
                        Privacy
                      </Link>
                    </li>
                    <li>
                      <a
                        href="mailto:hello@collectovault.com"
                        className="hover:underline"
                      >
                        Contact
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="text-sm text-slate-300">
                <div className="font-semibold mb-2">Get started</div>
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    className="transform transition ease-out duration-300 hover:scale-105"
                    onClick={() => navigate("/customer/register")}
                  >
                    Sign up
                  </Button>
                  <Link
                    to={ROUTES.LOGIN}
                    className="px-3 py-2 rounded border border-slate-700 text-sm transform transition ease-out duration-300 hover:scale-105"
                  >
                    Sign in
                  </Link>
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
