// src/pages/Pricing.tsx
// import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ROUTES from "../constants/routes";
import { Check } from "lucide-react";
import Navbar from "../components/layout/Navbar";

export default function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for individuals and small shops exploring loyalty programs.",
      features: [
        "Up to 100 customers",
        "Basic points tracking",
        "1 vendor dashboard",
        "Email support",
      ],
      cta: "Get Started",
      highlight: false,
      bg: "bg-slate-800/70",
    },
    {
      name: "Business",
      price: "UGX 50000/mo",
      description: "Ideal for small to mid-size businesses that need branded loyalty features.",
      features: [
        "Unlimited customers",
        "Advanced analytics",
        "Custom branding",
        "Vendor storefront & listings",
        "Priority support",
      ],
      cta: "Start Free Trial",
      highlight: true,
      bg: "bg-gradient-to-br from-emerald-600 via-teal-500 to-green-600",
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "Tailored for large-scale organizations needing integrations and APIs.",
      features: [
        "Unlimited vendors",
        "Dedicated Collecto API integration",
        "Onboarding & training",
        "Account manager",
        "24/7 priority support",
      ],
      cta: "Contact Sales",
      highlight: false,
      bg: "bg-slate-800/70",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <Navbar />
      
      <section className="text-center py-20 px-4">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-teal-300 mb-3"
        >
          Simple, Transparent Pricing
        </motion.h1>
        <p className="text-slate-300 text-lg max-w-2xl mx-auto">
          Choose a plan that fits your business. Scale your loyalty program effortlessly with CollectoVault.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 pb-24">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className={`rounded-2xl p-8 shadow-lg relative overflow-hidden border border-slate-700 ${plan.bg}`}
          >
            {plan.highlight && (
              <div className="absolute top-0 right-0 bg-emerald-500 text-xs font-semibold px-3 py-1 rounded-bl-lg">
                Most Popular
              </div>
            )}

            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
            <p className="text-slate-300 mb-6">{plan.description}</p>

            <div className="text-4xl font-extrabold mb-6">
              {plan.price}
              {plan.price !== "Free" && (
                <span className="text-slate-400 text-lg font-normal"> /month</span>
              )}
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-200">
                  <Check className="text-emerald-400 w-5 h-5 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              to={plan.name === "Enterprise" ? ROUTES.REGISTER : ROUTES.LOGIN}
              className={`block text-center py-3 px-5 rounded-md font-semibold shadow ${
                plan.highlight
                  ? "bg-white text-slate-900 hover:brightness-95"
                  : "bg-slate-700 hover:bg-slate-600"
              }`}
            >
              {plan.cta}
            </Link>
          </motion.div>
        ))}
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-linear-to-b from-slate-900 to-slate-950 text-center">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-3xl sm:text-4xl font-bold mb-6"
        >
          Ready to grow your loyalty program?
        </motion.h2>
        <p className="text-slate-400 mb-8">
          Join hundreds of businesses already rewarding customers with CollectoVault.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to={ROUTES.REGISTER}
            className="px-6 py-3 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition"
          >
            Get Started
          </Link>
          <Link
            to={ROUTES.REGISTER}
            className="px-6 py-3 border border-slate-600 text-white font-semibold rounded-lg hover:bg-slate-800 transition"
          >
            Become a Vendor
          </Link>
        </div>
      </section>
    </div>
  );
}
