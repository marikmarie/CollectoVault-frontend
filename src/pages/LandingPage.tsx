import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-500">
      <svg
        className="absolute left-0 top-0 w-[140%] h-full -translate-x-6 opacity-25 pointer-events-none mix-blend-screen animate-wave"
        viewBox="0 0 1600 600"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="g" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <filter id="blurGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* slow, large glowing lines (furthest back) */}
        <g
          className="wave-layer layer-1"
          stroke="url(#g)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          filter="url(#blurGlow)"
        >
          <path
            d="M0 260 C300 150 600 150 900 260 S1500 370 1600 260"
            opacity="0.12"
          />
          <path
            d="M0 300 C250 200 550 200 900 300 S1500 400 1600 300"
            opacity="0.18"
          />
        </g>

        {/* mid lines (move a bit faster) */}
        <g
          className="wave-layer layer-2"
          stroke="url(#g)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        >
          <path
            d="M0 340 C200 250 500 250 900 340 S1500 430 1600 340"
            opacity="0.10"
          />
        </g>

       
        <g
          className="wave-layer layer-3"
          stroke="url(#g)"
          strokeWidth="1"
          fill="none"
          opacity="0.22"
        >
          <path d="M0 230 C200 140 400 140 600 230 S1000 320 1200 230 S1600 140 1600 230" />
          <path d="M0 200 C200 120 400 120 600 200 S1000 280 1200 200 S1600 120 1600 200" />
          <path d="M0 380 C300 280 600 280 900 380 S1500 480 1600 380" />
        </g>
      </svg>

      <Navbar />
      <main className="relative max-w-5xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center gap-12">
        <section className="flex-1 space-y-6">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white">
            CollectoVault — Power Your Loyalty
          </h1>
          <p className="text-lg text-gray-200">
            Elegant loyalty management for customers. Track points, redeem
            rewards, and watch yourself move through tiers effortlessly.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/customer/login"
              className="px-6 py-3 bg-white text-blue-600 rounded-lg font-bold shadow-md hover:bg-green-50"
            >
              Get Started
            </Link>
            <Link
              to="/customer/login"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold shadow-md hover:bg-green-700"
            >
              Sign In
            </Link>
          </div>
        </section>

        <aside className="flex-1 bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-center mb-4">
            Member Preview
          </h3>

          {/* YouTube preview (autoplay muted loop) */}
          <div className="mx-auto mb-4 w-full max-w-[360px] rounded-lg overflow-hidden">
            <div className="aspect-video">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/watch?v=_7Ay4jIHIhU`}
                title="Member preview video"
                frameBorder="0"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          <div className="bg-gray-100 rounded p-4 text-center">
            <div className="text-4xl font-bold text-gray-800">1240 pts</div>
            <div className="text-gray-600 mt-1">Silver • 45% to Gold</div>
          </div>

          {/* Optional direct link fallback */}
          <div className="text-center mt-3">
            <a
              href="https://www.youtube.com/watch?v=_7Ay4jIHIhU"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:underline"
            >
              Open full preview
            </a>
          </div>
        </aside>
      </main>
      <section className="mt-16 max-w-3xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-6">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <img
              src="points.svg"
              alt="Earn Points"
              className="h-16 mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold">Earn Points</h3>
            <p className="text-white-600">
              Customers earn points with every purchase and engagement.
            </p>
          </div>
          <div className="text-center">
            <img
              src="reward.svg"
              alt="Redeem Rewards"
              className="h-16 mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold">Redeem Rewards</h3>
            <p className="text-white-600">
              Points can be redeemed for discounts, free products, or special
              perks.
            </p>
          </div>
          <div className="text-center">
            <img
              src="reward.svg"
              alt="Level Up"
              className="h-16 mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold">Level Up</h3>
            <p className="text-white-600">
              Customers progress through loyalty tiers for even greater
              benefits.
            </p>
          </div>
        </div>
      </section>
      <section className="mt-16 bg-gray-100 py-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">What Our Members Say</h2>
          <blockquote className="italic text-lg text-white-800">
            "CollectoVolt has completely streamlined our rewards program. Our
            customers love tracking points and claiming rewards!"
          </blockquote>
          <p className="mt-4 text-white-600">— Samson Johnson, Forest Mall</p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
