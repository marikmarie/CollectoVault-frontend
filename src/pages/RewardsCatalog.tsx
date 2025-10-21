import React from 'react'
import Navbar from '../components/Navbar'
import RewardCard from '../components/RewardCard'
import { rewards } from '../data/dummy'

const RewardsCatalog: React.FC = () => {
  const handleRedeem = (id: string) => alert('Redeem: ' + id)
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl text-white mb-4">Rewards Catalog</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rewards.map(r => <RewardCard key={r.id} reward={r} onRedeem={handleRedeem} />)}
        </div>
      </main>
    </div>
  )
}

export default RewardsCatalog
