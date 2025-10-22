import React from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Card from '../components/Card'

const RedeemReward: React.FC = () => {
  const handleRedeem = () => {
    alert('🎁 Redeem process initiated — this is a mock flow.')
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Navbar />

      <main className="max-w-3xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-8 bg-slate-800/60 backdrop-blur-md border border-slate-700 rounded-2xl shadow-lg">
            <header className="mb-6 text-center">
              <h2 className="text-3xl font-bold text-accent mb-2">Redeem Reward</h2>
              <p className="text-slate-400 text-sm">
                Confirm reward redemptions for customers. In the full version, this will connect to the CollectoVolt backend to process reward claims.
              </p>
            </header>

            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-5 mb-6">
              <h3 className="text-lg font-semibold text-white mb-1">Reward Preview</h3>
              <p className="text-slate-400 text-sm mb-3">
                e.g. “Free Coffee Coupon” — 500 pts required
              </p>
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>Customer: <strong className="text-white">John Doe</strong></span>
                <span>Balance: <strong className="text-accent">1240 pts</strong></span>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                className="px-5 py-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                onClick={() => alert('Action cancelled')}
              >
                Cancel
              </button>
              <button
                className="px-5 py-3 bg-accent rounded-lg font-semibold hover:bg-accent/90 transition-all shadow-md"
                onClick={handleRedeem}
              >
                Confirm Redeem
              </button>
            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}

export default RedeemReward
