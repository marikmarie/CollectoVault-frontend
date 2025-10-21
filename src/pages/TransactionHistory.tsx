import React from 'react'
import Navbar from '../components/Navbar'
import Card from '../components/Card'
import { transactions } from '../data/dummy'

const TransactionHistory: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto p-6">
        <h2 className="text-xl text-white font-semibold mb-4">Transaction History</h2>
        <Card>
          <div className="space-y-3">
            {transactions.map(t => (
              <div key={t.id} className="flex items-center justify-between p-2 bg-background rounded">
                <div>
                  <div className="text-white">{t.note}</div>
                  <div className="text-neutral text-sm">{t.date}</div>
                </div>
                <div className={`font-semibold ${t.points>0 ? 'text-accent' : 'text-red-400'}`}>{t.points>0? '+'+t.points: t.points} pts</div>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  )
}

export default TransactionHistory
