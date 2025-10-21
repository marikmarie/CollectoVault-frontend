import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'

type Form = { email: string; password: string }

const CustomerLogin: React.FC = () => {
  const navigate = useNavigate()
  const { register, handleSubmit } = useForm<Form>()
  const { loginCustomer } = useAuth()

  const onSubmit = (data: Form) => {
    loginCustomer(data.email)
    navigate('/customer/dashboard')
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-md mx-auto mt-12 card">
        <h2 className="text-2xl text-white font-semibold mb-4">Customer Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-neutral text-sm">Email</label>
            <input {...register('email', { required: true })} className="w-full mt-1 p-2 rounded bg-background border border-primary" defaultValue="alice@example.com" />
          </div>
          <div>
            <label className="text-neutral text-sm">Password</label>
            <input type="password" {...register('password', { required: true })} className="w-full mt-1 p-2 rounded bg-background border border-primary" defaultValue="password" />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="px-4 py-2 bg-accent rounded">Login</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CustomerLogin
