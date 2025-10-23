import React from 'react'
import { useForm } from 'react-hook-form'
import Navbar from '../../components/layout/Navbar'
import Card from '../../components/common/Card'
import { useData } from '../../context/DataContext'
import { motion } from 'framer-motion'

type AwardForm = {
  customerId: string
  points: number
}

const PointsAward: React.FC = () => {
  const { register, handleSubmit, reset } = useForm<AwardForm>()
  const { customers, awardPoints } = useData()

  const onSubmit = (data: AwardForm) => {
    if (!data.customerId || !data.points || data.points <= 0) {
      alert('Please enter valid details')
      return
    }
    awardPoints(data.customerId, Number(data.points), 'Manual award via staff UI')
    alert(`🎉 Awarded ${data.points} points to customer ${data.customerId}`)
    reset()
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Navbar />

      <main className="max-w-2xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-8 shadow-lg bg-slate-800/60 backdrop-blur-md border border-slate-700 rounded-2xl">
            <div className="mb-6 text-center">
              <h2 className="text-3xl font-bold text-accent mb-2">Award Loyalty Points</h2>
              <p className="text-slate-400 text-sm">
                Reward your customers manually. Add points to recognize loyalty, resolve issues, or run promotions.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Select Customer</label>
                <select
                  {...register('customerId', { required: true })}
                  className="w-full mt-1 p-3 rounded-lg bg-slate-900 border border-slate-700 focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                >
                  <option value="">Choose customer</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Points to Award</label>
                <input
                  type="number"
                  {...register('points', { required: true, min: 1 })}
                  placeholder="e.g. 100"
                  className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-all shadow-md"
                >
                  Award Points
                </button>
              </div>
            </form>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}

export default PointsAward
