import React, { useState } from 'react'
import Navbar from '../../components/layout/Navbar'
import Card from '../../components/common/Card'
import { customers } from '../../data/dummy'
import { Link } from 'react-router-dom'
import Button from '../../components/common/Button'
//import { Search, Users, Award, Settings } from 'lucide-react'
import { Search, Users } from 'lucide-react'

const StaffDashboard: React.FC = () => {
  const [query, setQuery] = useState('')

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.id.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navbar />

      <main className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Staff Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage customers, award points, and oversee rewards.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/award">
              <Button label="Award Points" />
            </Link>
            <Link to="/admin/rewards">
              <Button label="Manage Rewards" variant="secondary" />
            </Link>
          </div>
        </div>

        {/* Search Section */}
        <Card>
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search customers by name or ID"
              className="w-full pl-10 pr-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </Card>

        {/* Customer List */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Users size={18} className="text-emerald-400" />
            <h2 className="text-lg font-semibold">Customers</h2>
          </div>

          {filtered.length === 0 ? (
            <div className="text-slate-400 text-center py-6">No customers found.</div>
          ) : (
            <div className="divide-y divide-slate-800">
              {filtered.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-slate-800/70 transition-all"
                >
                  <div>
                    <div className="font-medium text-white flex items-center gap-2">
                      {c.name}
                      <span className="text-slate-400 text-sm">({c.id})</span>
                    </div>
                    <div className="text-slate-400 text-sm">{c.email}</div>
                  </div>
                  <div className="text-emerald-400 font-semibold">{c.points} pts</div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </main>
    </div>
  )
}

export default StaffDashboard
