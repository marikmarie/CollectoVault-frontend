import React, { useState } from 'react'
import Button from './Button'
import { Reward } from '../data/dummy'
import Modal from './Modal'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'

const RewardCard: React.FC<{reward: Reward}> = ({ reward }) => {
  const [open, setOpen] = useState(false)
  const { redeemReward } = useData()
  const { user } = useAuth()

  const onConfirm = () => {
    if (!user || user.role !== 'customer') {
      alert('Please login as a customer to redeem in the demo.')
      setOpen(false)
      return
    }
    const res = redeemReward(user.id, reward.id)
    alert(res.message)
    setOpen(false)
  }

  return (
    <div className="card flex flex-col">
      <div className="h-36 rounded-md bg-primary/20 mb-3 flex items-center justify-center text-white font-medium">{reward.title}</div>
      <h3 className="text-white font-semibold text-lg">{reward.title}</h3>
      <p className="text-neutral text-sm flex-1 my-2">{reward.description}</p>
      <div className="flex items-center justify-between mt-3">
        <div className="text-accent font-bold">{reward.points} pts</div>
        <Button label="Redeem" onClick={() => setOpen(true)} />
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={`Redeem ${reward.title}`}>
        <p className="text-neutral mb-4">Are you sure you want to redeem <strong>{reward.title}</strong> for <strong>{reward.points} pts</strong>?</p>
        <div className="flex justify-end gap-2">
          <button onClick={() => setOpen(false)} className="px-3 py-2 bg-primary rounded">Cancel</button>
          <button onClick={onConfirm} className="px-3 py-2 bg-accent rounded">Confirm</button>
        </div>
      </Modal>
    </div>
  )
}

export default RewardCard
