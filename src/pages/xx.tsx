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
    imageUrl: "/images/spa.png",
    tags: ["Popular"],
  },
  {
    id: "r2",
    title: "Dinner for Two",
    description: "Three-course dining experience with complimentary dessert.",
    pointsPrice: 800,
    currencyPrice: 10000,
    vendorName: "Emperor Hotel",
    imageUrl: "/images/dinner.png",
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
    imageUrl: "/images/room.png",
    tags: ["Limited"],
  },
];

const sampleVendors = [
  { id: "v1", name: "Forest Park Resort", logo: "/assets/images/vendor-forestpark.png" },
  { id: "v2", name: "Forest Mall", logo: "/assets/images/vendor-forestmall.png" },
  { id: "v3", name: "Emperor Restaurant", logo: "/assets/images/vendor-lakeview.png" },
];

// Replace VIDEO_SRC with your optimized mp4/webm asset or an external CDN-hosted clip
const VIDEO_SRC = "/videos/video.mp4"; // <-- swap with your own

const LandingPageRevamp: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative text-white bg-slate-900">
      <Navbar />

      {/* Full-bleed video background (Shopify-style) */}
      <div className="absolute inset-0 -z-30 overflow-hidden">
        <video
          className="w-full h-full object-cover pointer-events-none"
          src={VIDEO_SRC}
          autoPlay
          muted
          loop
          playsInline
          poster="/images/spa.png"
          aria-hidden
        />
        {/* Soft gradient overlay to ensure text contrast */}
        <div className="absolute inset-0 bg-linear-to-b from-black/35 via-black/20 to-black/60 -z-20" />

        {/* Decorative blurred shapes */}
        <div className="absolute -left-40 -top-24 w-[900px] h-[900px] rounded-full bg-linear-to-r from-emerald-400/20 to-indigo-500/10 filter blur-3xl opacity-60 animate-blob" />
      </div>

      <main className="relative max-w-7xl mx-auto px-6 py-28">
        {/* Hero */}
        <section className="text-center max-w-4xl mx-auto">
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight drop-shadow-md"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Build unforgettable loyalty experiences */}
             CollectoVault —Power your loyalty
            <br />
            <span className="bg-clip-text text-transparent bg-linear-to-r from-emerald-300 to-purple-400">
              across hotels, restaurants & retail
            </span>
          </motion.h1>

          <motion.p
            className="mt-6 text-lg sm:text-xl text-slate-200 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7 }}
          >
            Delight customers with points, tiers and cross-business rewards — all
            managed from a beautiful dashboard and a powerful API.
          </motion.p>

          <motion.div
            className="mt-8 flex items-center justify-center gap-4 flex-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              variant="primary"
              className="px-6 py-3 text-base shadow-2xl"
              onClick={() => navigate(ROUTES.REGISTER || "/register")}
            >
              Start Free Trial
            </Button>

            <Link
              to={ROUTES.LOGIN}
              className="inline-flex items-center px-5 py-3 rounded-md border border-white/20 hover:bg-white/5 text-sm"
            >
              Sign in
            </Link>

            <a
              href="#how-it-works"
              className="inline-flex items-center px-4 py-3 rounded-md bg-white/5 text-sm hover:bg-white/7"
            >
              Learn how
            </a>
          </motion.div>

          {/* Social proof row */}
          {/* <motion.div
            className="mt-10 flex items-center justify-center gap-8 text-slate-200 text-sm flex-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
          >
            <div className="flex items-center gap-3">
              <img src="/assets/images/vendor-forestpark.png" alt="Forest Park" className="w-8 h-8 object-contain rounded" />
              <span className="opacity-90">Forest Park Resort</span>
            </div>

            <div className="flex items-center gap-3">
              <img src="/assets/images/vendor-forestmall.png" alt="Forest Mall" className="w-8 h-8 object-contain rounded" />
              <span className="opacity-90">Forest Mall</span>
            </div>

            <div className="hidden sm:flex items-center gap-3">
              <img src="/assets/images/vendor-lakeview.png" alt="Emperor" className="w-8 h-8 object-contain rounded" />
              <span className="opacity-90">Emperor Restaurant</span>
            </div>
          </motion.div> */}
        </section>

        {/* Feature cards */}
        <section id="how-it-works" className="mt-20">
          <motion.h2
            className="text-2xl font-bold text-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Powerful features to grow your business
          </motion.h2>

          <motion.div
            className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white/5 border border-white/6 rounded-2xl p-6 shadow-lg backdrop-blur-md hover:translate-y-1.5 transition-transform">
              <div className="text-emerald-300 mb-2 font-semibold">Earn</div>
              <h3 className="font-semibold text-lg">Points that keep customers coming back</h3>
              <p className="text-slate-300 mt-2 text-sm">Award points per purchase, per action, or through campaigns — flexible rules to match your business.</p>
            </div>

            <div className="bg-white/5 border border-white/6 rounded-2xl p-6 shadow-lg backdrop-blur-md hover:translate-y-1.5 transition-transform">
              <div className="text-emerald-300 mb-2 font-semibold">Redeem</div>
              <h3 className="font-semibold text-lg">Cross-business redemptions</h3>
              <p className="text-slate-300 mt-2 text-sm">Let customers spend points across hotels, restaurants and shops — increase average basket value and partner synergies.</p>
            </div>

            <div className="bg-white/5 border border-white/6 rounded-2xl p-6 shadow-lg backdrop-blur-md hover:translate-y-1.5 transition-transform">
              <div className="text-emerald-300 mb-2 font-semibold">Analyze</div>
              <h3 className="font-semibold text-lg">Clear analytics & API</h3>
              <p className="text-slate-300 mt-2 text-sm">Understand program performance with built-in reporting and integrate deeply via our API.</p>
            </div>
          </motion.div>
        </section>

        {/* Rewards grid (eye-catching cards) */}
        <section className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Featured rewards</h2>
            <Link to="/customer/rewards" className="text-sm text-slate-200 underline">View all</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleRewards.map((r, i) => (
              <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }} whileHover={{ translateY: -6 }}>
                <RewardCard
                  id={r.id}
                  title={r.title}
                  description={r.description}
                  pointsPrice={r.pointsPrice}
                  currencyPrice={r.currencyPrice}
                  vendorName={r.vendorName}
                  imageUrl={r.imageUrl}
                  tags={r.tags}
                />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Partners */}
        <section className="mt-16">
          <h3 className="text-lg font-semibold mb-4">Trusted by</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 items-center">
            {sampleVendors.map((v) => (
              <div key={v.id} className="flex items-center gap-3 p-3 bg-white/3 rounded">
                <img src={v.logo} alt={v.name} className="w-12 h-12 object-contain" />
                <div className="hidden sm:block text-sm text-slate-200">{v.name}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA / Pricing */}
        <section className="mt-20 bg-linear-to-r from-slate-800/40 to-slate-900/40 border border-white/6 rounded-2xl p-8">
          <div className="md:flex md:items-center md:justify-between">
            <div>
              <h3 className="text-2xl font-bold">Ready to launch your loyalty program?</h3>
              <p className="text-slate-300 mt-2">Start with a free trial, then scale with our flexible plans and API integrations.</p>
            </div>

            <div className="mt-6 md:mt-0 flex gap-4">
              <Button variant="primary" onClick={() => navigate(ROUTES.REGISTER || "/register")}>Start free</Button>
              <Link to="/pricing" className="px-4 py-3 rounded-md border border-white/10">See plans</Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 pb-12 text-slate-300">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-lg font-bold">CollectoVault</div>
              <div className="text-sm mt-2">Power your loyalty — beautiful, reliable, and easy to integrate.</div>
            </div>

            <div className="flex gap-6">
              <div>
                <div className="font-semibold mb-2">Product</div>
                <ul className="text-sm space-y-1">
                  <li><Link to="/how-it-works" className="hover:underline">How it works</Link></li>
                  <li><Link to="/customer/rewards" className="hover:underline">Rewards</Link></li>
                  <li><Link to="/pricing" className="hover:underline">Pricing</Link></li>
                </ul>
              </div>

              <div>
                <div className="font-semibold mb-2">Company</div>
                <ul className="text-sm space-y-1">
                  <li><Link to="/terms" className="hover:underline">Terms</Link></li>
                  <li><Link to="/privacy" className="hover:underline">Privacy</Link></li>
                  <li><a href="mailto:hello@collectovault.com" className="hover:underline">Contact</a></li>
                </ul>
              </div>
            </div>

            <div>
              <div className="font-semibold mb-2">Get started</div>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => navigate(ROUTES.REGISTER || "/register")}>Sign up</Button>
                <Link to={ROUTES.LOGIN} className="px-3 py-2 rounded border border-white/10">Sign in</Link>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-xs text-slate-500">© {new Date().getFullYear()} CollectoVault. All rights reserved.</div>
        </footer>
      </main>

      {/* small helper styles sometimes used in tailwind config (animate-blob) */}
      <style>{`
        @keyframes blob { 0% { transform: translate(0px, 0px) } 33% { transform: translate(30px, -50px) } 66% { transform: translate(-20px, 20px) } 100% { transform: translate(0px, 0px) } }
        .animate-blob { animation: blob 10s infinite; }
      `}</style>
    </div>
  );
};

export default LandingPageRevamp;
