import React from 'react'
import Navbar from '../components/Navbar'
import Card from '../components/Card'

const RedeemReward: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-3xl mx-auto p-6">
        <Card>
          <h2 className="text-xl text-white font-semibold mb-2">Redeem Reward</h2>
          <p className="text-neutral mb-4">This is a mock flow. Selecting rewards will show a confirmation prompt in the real app.</p>
          <div className="flex justify-end">
            <button className="px-4 py-2 bg-accent rounded">Confirm Redeem</button>
          </div>
        </Card>
      </main>
    </div>
  )
}

export default RedeemReward
