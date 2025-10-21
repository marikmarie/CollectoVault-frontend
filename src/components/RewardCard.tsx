import React from 'react'
import Button from './Button'
import type{ Reward } from '../data/dummy'

const RewardCard: React.FC<{reward: Reward, onRedeem?: (id: string) => void}> = ({ reward, onRedeem }) => {
  return (
    <div className="card flex flex-col">
      <div className="h-36 rounded-md bg-primary/20 mb-3 flex items-center justify-center text-white font-medium">{reward.title}</div>
      <h3 className="text-white font-semibold text-lg">{reward.title}</h3>
      <p className="text-neutral text-sm flex-1 my-2">{reward.description}</p>
      <div className="flex items-center justify-between mt-3">
        <div className="text-accent font-bold">{reward.points} pts</div>
        <Button label="Redeem" onClick={() => onRedeem && onRedeem(reward.id)} />
      </div>
    </div>
  )
}

export default RewardCard
