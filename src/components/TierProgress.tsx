import React from 'react'
import { Trophy, Star, Crown } from 'lucide-react'

const TierProgress: React.FC<{ points: number }> = ({ points }) => {
  const tiers = [
    { name: 'Bronze', threshold: 0, color: 'text-amber-500', icon: <Trophy size={18} /> },
    { name: 'Silver', threshold: 1000, color: 'text-gray-300', icon: <Star size={18} /> },
    { name: 'Gold', threshold: 3000, color: 'text-yellow-400', icon: <Crown size={18} /> },
  ]

  const currentIndex = tiers.reduce((acc, t, i) => (points >= t.threshold ? i : acc), 0)
  const current = tiers[currentIndex]
  const next = tiers[Math.min(currentIndex + 1, tiers.length - 1)]
  const progress = Math.min(
    100,
    Math.round(
      ((points - current.threshold) / Math.max(1, next.threshold - current.threshold)) * 100
    )
  )

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-md transition-all hover:shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-white">
          <div className={`${current.color}`}>{current.icon}</div>
          <div className="text-sm font-semibold">
            {current.name} Tier
          </div>
        </div>
        <div className="text-sm text-slate-400">{points.toLocaleString()} pts</div>
      </div>

      <div className="relative w-full bg-slate-700 rounded-full h-3 overflow-hidden">
        <div
          className="absolute top-0 left-0 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
        <span>
          {progress < 100
            ? `Progress to ${next.name}: ${progress}%`
            : `Maxed out at ${current.name}!`}
        </span>
        {progress < 100 && (
          <span className="text-slate-500">
            {next.threshold - points} pts to {next.name}
          </span>
        )}
      </div>
    </div>
  )
}

export default TierProgress
