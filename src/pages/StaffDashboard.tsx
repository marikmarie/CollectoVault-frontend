import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Card from '../components/Card'
import { customers } from '../data/dummy'
import { Link } from 'react-router-dom'
import Button from '../components/Button'

const StaffDashboard: React.FC = () => {
  const [query, setQuery] = useState('')
  const filtered = customers.filter(c => c.name.toLowerCase().includes(query.toLowerCase()) || c.id.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-5xl mx-auto p-6 space-y-6">
        <Card>
          <div className="flex items-center justify-between">
            <h2 className="text-lg text-white font-semibold">Staff Dashboard</h2>
            <div className="space-x-2">
              <Link to="/award"><Button label="Award Points" /></Link>
              <Link to="/admin/rewards"><Button label="Manage Rewards" variant="secondary" /></Link>
            </div>
          </div>
        </Card>

        <Card>
          <div className="mb-4">
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search customers by name or ID" className="w-full p-2 rounded bg-background border border-primary" />
          </div>
          <div className="space-y-3">
            {filtered.map(c => (
              <div key={c.id} className="flex items-center justify-between p-2 bg-background rounded">
                <div>
                  <div className="text-white font-semibold">{c.name} <span className="text-neutral text-sm">({c.id})</span></div>
                  <div className="text-neutral text-sm">{c.email}</div>
                </div>
                <div className="text-accent font-bold">{c.points} pts</div>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  )
}

export default StaffDashboard
