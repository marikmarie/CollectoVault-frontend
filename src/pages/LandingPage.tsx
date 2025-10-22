import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

const LandingPage: React.FC = () => {
  return (
     <div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-500">
       {/* <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">  */}

      <Navbar />
      <main className="relative max-w-5xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center gap-12">
        <section className="flex-1 space-y-6">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white">
            CollectoVault — Power Your Loyalty
          </h1>
          <p className="text-lg text-gray-200">
            Elegant loyalty management for customers. Track points, redeem rewards, and watch yourself move through tiers effortlessly.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/customer/login"
              className="px-6 py-3 bg-white text-green-600 rounded-lg font-bold shadow-md hover:bg-green-50"
            >
              Get Started
            </Link>
            <Link
              to="/customer/login"
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-bold shadow-md hover:bg-green-700"
            >
            Sign In
            </Link>
          </div>
        </section>
        <aside className="flex-1 bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-center mb-4">Member Preview</h3>
          <img src="/images/trophy.png" alt="Reward Trophy" className="h-32 mx-auto mb-4"/>
          <div className="bg-gray-100 rounded p-4 text-center">
            <div className="text-4xl font-bold text-gray-800">1240 pts</div>
            <div className="text-gray-600 mt-1">Silver • 45% to Gold</div>
          </div>
        </aside>
      </main>
      <section className="mt-16 max-w-3xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-6">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <img src="/icons/points.svg" alt="Earn Points" className="h-16 mx-auto mb-4"/>
            <h3 className="text-xl font-semibold">Earn Points</h3>
            <p className="text-white-600">Customers earn points with every purchase and engagement.</p>
          </div>
          <div className="text-center">
            <img src="/icons/reward.svg" alt="Redeem Rewards" className="h-16 mx-auto mb-4"/>
            <h3 className="text-xl font-semibold">Redeem Rewards</h3>
            <p className="text-white-600">Points can be redeemed for discounts, free products, or special perks.</p>
          </div>
          <div className="text-center">
            <img src="/icons/tier.svg" alt="Level Up" className="h-16 mx-auto mb-4"/>
            <h3 className="text-xl font-semibold">Level Up</h3>
            <p className="text-white-600">Customers progress through loyalty tiers for even greater benefits.</p>
          </div>
        </div>
      </section>
      <section className="mt-16 bg-gray-100 py-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">What Our Members Say</h2>
          <blockquote className="italic text-lg text-white-800">
            "CollectoVolt has completely streamlined our rewards program. Our customers love tracking points and claiming rewards!"
          </blockquote>
          <p className="mt-4 text-white-600">— Samson Johnson, Forest Mall</p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
