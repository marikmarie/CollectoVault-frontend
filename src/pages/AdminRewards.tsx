import React from 'react'
import Navbar from '../components/Navbar'
import Card from '../components/Card'
import { useForm } from 'react-hook-form'

const AdminRewards: React.FC = () => {
  const { register, handleSubmit } = useForm<{title: string; points: number; description: string}>()
  const onSubmit = (data: any) => alert('Created reward: ' + data.title)

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-3xl mx-auto p-6">
        <Card>
          <h2 className="text-xl text-white font-semibold mb-4">Manage Rewards (UI only)</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-neutral text-sm">Title</label>
              <input {...register('title')} className="w-full mt-1 p-2 rounded bg-background border border-primary" />
            </div>
            <div>
              <label className="text-neutral text-sm">Points</label>
              <input type="number" {...register('points')} className="w-full mt-1 p-2 rounded bg-background border border-primary" />
            </div>
            <div>
              <label className="text-neutral text-sm">Description</label>
              <textarea {...register('description')} className="w-full mt-1 p-2 rounded bg-background border border-primary" />
            </div>
            <div className="flex justify-end">
              <button type="submit" className="px-4 py-2 bg-accent rounded">Create</button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  )
}

export default AdminRewards
