import React from 'react'

const TierProgress: React.FC<{points: number}> = ({ points }) => {
  const tiers = [
    { name: 'Bronze', threshold: 0 },
    { name: 'Silver', threshold: 1000 },
    { name: 'Gold', threshold: 3000 },
  ]

  const currentIndex = tiers.reduce((acc, t, i) => points >= t.threshold ? i : acc, 0)
  const current = tiers[currentIndex]
  const next = tiers[Math.min(currentIndex + 1, tiers.length - 1)]
  const progress = Math.min(100, Math.round(((points - current.threshold) / Math.max(1, (next.threshold - current.threshold))) * 100))

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-neutral">Tier: <span className="font-semibold text-white">{current.name}</span></div>
        <div className="text-sm text-neutral">{points} pts</div>
      </div>
      <div className="w-full bg-primary/30 rounded-full h-3">
        <div className="bg-accent h-3 rounded-full" style={{ width: `${progress}%` }} />
      </div>
      <div className="text-xs text-neutral mt-2">Progress to next: {progress}%</div>
    </div>
  )
}

export default TierProgress
