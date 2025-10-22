import React from 'react'
import Navbar from '../components/Navbar'
import Card from '../components/Card'
import TierProgress from '../components/TierProgress'
import { customers, rewards } from '../data/dummy'
import RewardCard from '../components/RewardCard'
import { Link } from 'react-router-dom'

const CustomerDashboard: React.FC = () => {
  const user = customers[0]

  return (
    <div className="min-h-screen  bg-slate-900 text-white">
      {/* <div className="min-h-screen bg-linear-60  text-white"> */}
      <Navbar />

      <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* LEFT: Profile & quick actions */}
        <aside className="lg:col-span-1 space-y-4 sticky top-6">
          <Card className="p-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-linear-to-tr from-slate-800 to-slate-700 flex items-center justify-center text-xl font-bold text-white">{(user.firstName || 'U').slice(0,1).toUpperCase()}</div>
              <div>
                <div className="text-sm text-slate-300">Welcome back</div>
                <div className="text-lg font-semibold">{user.firstName} {user.lastName}</div>
                <div className="text-xs text-slate-400 mt-1">Member since {user.joined ?? '—'}</div>
              </div>
            </div>

            <div className="mt-5">
              <div className="text-xs text-slate-400">Balance</div>
              <div className="text-3xl font-extrabold text-emerald-300">{user.points} <span className="text-sm text-slate-400">pts</span></div>

              <div className="mt-4">
                <TierProgress points={user.points} />
                <div className="text-sm text-slate-400 mt-2">{user.tier} • {Math.max(0, (user.nextTierAt ?? 0) - user.points)} pts to next tier</div>
              </div>

              <div className="mt-4 flex gap-2">
                <Link to="/rewards" className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-emerald-500 font-semibold hover:bg-emerald-600">Redeem</Link>
                <Link to="/customer/history" className="inline-flex items-center justify-center px-3 py-2 rounded-md bg-slate-800 border border-slate-700 text-sm">History</Link>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">Tier</div>
                <div className="text-white font-semibold">{user.tier}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-400">Rank</div>
                <div className="text-white font-semibold">{user.rank ?? '—'}</div>
              </div>
            </div>

            <div className="mt-4 text-sm text-slate-300">Pro tip: Earn points faster by shopping on weekends and referring friends.</div>
          </Card>

          <Card className="p-4">
            <h4 className="text-sm font-semibold mb-2">Recent activity</h4>
            <ul className="space-y-3 text-sm text-slate-300">
              {user.recent?.length ? (
                user.recent.slice(0,4).map((it: any) => (
                  <li key={it.id} className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-medium">{it.title}</div>
                      <div className="text-xs text-slate-400">{it.when}</div>
                    </div>
                    <div className="text-sm text-emerald-300">{it.points > 0 ? `+${it.points}` : it.points}</div>
                  </li>
                ))
              ) : (
                <li className="text-slate-500">No recent activity</li>
              )}
            </ul>
            <div className="mt-3 text-right">
              <Link to="/customer/history" className="text-sm text-slate-400 hover:underline">See all</Link>
            </div>
          </Card>
        </aside>

        {/* RIGHT: Rewards & main content */}
        <section className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Available Rewards</h2>
              <p className="text-sm text-slate-400 mt-1">Use your points to claim exclusive rewards and discounts.</p>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/rewards" className="text-sm text-slate-400 hover:underline">Browse all</Link>
            </div>
          </div>

          {/* Featured reward */}
          {rewards[0] && (
            <div className="rounded-xl overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-linear-to-r from-slate-800/70 to-slate-700/40 p-4 rounded-xl">
                <div className="md:col-span-1 flex items-center justify-center h-36 bg-linear-to-br from-green-500/30 to-emerald-400/10 rounded-lg">
                  {rewards[0].image ? (
                    <img src={rewards[0].image} alt={rewards[0].title} className="object-cover w-full h-full rounded" />
                  ) : (
                    <div className="text-white font-semibold">{rewards[0].title}</div>
                  )}
                </div>

                <div className="md:col-span-2 p-3">
                  <h3 className="text-xl font-bold">{rewards[0].title}</h3>
                  <p className="text-slate-300 mt-2">{rewards[0].description}</p>
                  <div className="mt-4 flex items-center gap-4">
                    <div className="text-2xl font-extrabold text-emerald-300">{rewards[0].points} pts</div>
                    <Link to="/rewards" className="px-4 py-2 bg-emerald-500 rounded-md font-semibold hover:bg-emerald-600">Redeem</Link>
                    <Link to="/rewards" className="text-sm text-slate-400 hover:underline">View details</Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rewards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewards.slice(1).map(r => (
              <RewardCard key={r.id} reward={r} />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default CustomerDashboard
