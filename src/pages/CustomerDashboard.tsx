import React from 'react'
import Navbar from '../components/Navbar'
import Card from '../components/Card'
import TierProgress from '../components/TierProgress'
import { customers, rewards } from '../data/dummy'
import RewardCard from '../components/RewardCard'
import { Link } from 'react-router-dom'

const CustomerDashboard: React.FC = () => {
  const user = customers[0]

  const handleRedeem = (id: string) => {
    alert('Redeem clicked: ' + id)
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <aside className="lg:col-span-1 space-y-4">
          <Card>
            <div className="text-sm text-neutral">Balance</div>
            <div className="text-3xl font-bold text-white">{user.points} pts</div>
            <div className="mt-4"><TierProgress points={user.points} /></div>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-neutral">Tier</div>
                <div className="text-white font-semibold">{user.tier}</div>
              </div>
              <div>
                <Link to="/customer/history" className="text-accent">View history</Link>
              </div>
            </div>
          </Card>
        </aside>

        <section className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl text-white font-semibold">Available Rewards</h2>
            <Link to="/rewards" className="text-neutral">Browse all</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {rewards.map(r => <RewardCard key={r.id} reward={r} />)}
          </div>
        </section>
      </main>
    </div>
  )
}

export default CustomerDashboard
