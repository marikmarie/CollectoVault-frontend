import React from 'react'
import Navbar from '../components/Navbar'
import Card from '../components/Card'
import { useForm } from 'react-hook-form'
import { useData } from '../context/DataContext'

const PointsAward: React.FC = () => {
  const { register, handleSubmit } = useForm<{customerId: string, points: number}>()
  const { customers, awardPoints } = useData()
  const onSubmit = (data: any) => {
    awardPoints(data.customerId, Number(data.points), 'Manual award via staff UI')
    alert('Awarded ' + data.points + ' to ' + data.customerId)
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-2xl mx-auto p-6">
        <Card>
          <h2 className="text-xl text-white font-semibold mb-4">Award Points</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-neutral text-sm">Customer</label>
              <select {...register('customerId')} className="w-full mt-1 p-2 rounded bg-background border border-primary">
                {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.id})</option>)}
              </select>
            </div>
            <div>
              <label className="text-neutral text-sm">Points</label>
              <input type="number" {...register('points')} className="w-full mt-1 p-2 rounded bg-background border border-primary" />
            </div>
            <div className="flex justify-end">
              <button type="submit" className="px-4 py-2 bg-accent rounded">Award</button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  )
}

export default PointsAward
