import React, { useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import RewardCard from '../components/RewardCard'
import { rewards as rewardsData } from '../data/dummy'
import { useAuth } from '../context/AuthContext'

const RewardsCatalog: React.FC = () => {
  const { user } = useAuth()
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<'recommended' | 'points-asc' | 'points-desc'>('recommended')

  const filtered = useMemo(() => {
    let items = rewardsData.slice()
    if (query.trim()) {
      const q = query.toLowerCase()
      items = items.filter(r => r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q))
    }

    if (sort === 'points-asc') items.sort((a, b) => a.points - b.points)
    if (sort === 'points-desc') items.sort((a, b) => b.points - a.points)
    return items
  }, [query, sort])

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navbar />
      <main className="max-w-6xl mx-auto p-6">
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold">Rewards Catalog</h2>
            <p className="text-slate-400 mt-1">Browse redeemable rewards — use points to claim discounts, freebies, and special experiences.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-slate-300">{user ? `You have ${user.points ?? 0} pts` : 'Log in to see your balance'}</div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search rewards"
              className="rounded-md px-3 py-2 bg-slate-800 border border-slate-700 placeholder:text-slate-400 text-white"
            />
            <select value={sort} onChange={(e) => setSort(e.target.value as any)} className="rounded-md px-2 py-2 bg-slate-800 border border-slate-700 ">
              <option value="recommended">Recommended</option>
              <option value="points-asc">Lowest points</option>
              <option value="points-desc">Highest points</option>
            </select>
          </div>
        </header>

        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(r => (
              <RewardCard key={r.id} reward={r} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="mt-12 text-center text-slate-400">No rewards matched your search.</div>
          )}
        </section>
      </main>
    </div>
  )
}

export default RewardsCatalog
