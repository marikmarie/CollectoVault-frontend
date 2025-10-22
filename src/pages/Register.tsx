import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'

type Form = {
  firstName: string
  lastName?: string
  email: string
  phone?: string
  password: string
  confirmPassword: string
  acceptTerms?: boolean
}

const Register: React.FC = () => {
  const navigate = useNavigate()
  const { register: authRegister } = useAuth() as any
  const { register, handleSubmit, setError, setValue, formState: { errors, isSubmitting } } = useForm<Form>({
    defaultValues: { firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '', acceptTerms: false }
  })
  const [serverError, setServerError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

 //const password = watch('password')

  const onSubmit = async (data: Form) => {
    setServerError(null)

    if (data.password !== data.confirmPassword) {
      setError('confirmPassword', { message: 'Passwords do not match' })
      return
    }

    if (!data.acceptTerms) {
      setError('acceptTerms', { message: 'You must accept the terms to continue' })
      return
    }

    try {
      // call auth context register function (adapt signature as needed)
      await (authRegister as any)?.(data)
      // optionally navigate to dashboard or show verification
      navigate('/customer/dashboard')
    } catch (err: any) {
      setServerError(err?.message ?? 'Registration failed. Please try again.')
    }
  }

  const fillDemo = () => {
    // helpful for demo / quick testing — use react-hook-form setValue instead of direct DOM writes
    setValue('firstName', 'Mariam')
    setValue('lastName', 'Tukas')
    setValue('email', 'mariam@gmail.com')
    setValue('phone', '+25674688000')
    setValue('password', 'password')
    setValue('confirmPassword', 'password')
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-800 via-slate-700 to-slate-900 text-white">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left: Brand pitch */}
          <section className="space-y-6">
            <h1 className="text-3xl md:text-4xl font-extrabold">Create your CollectoVolt account</h1>
            <p className="text-slate-300">Join today to start earning points, unlocking rewards, and leveling up through tiers. Secure, fast, and easy to use.</p>

            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li>• Earn points for purchases and activities</li>
              <li>• Redeem rewards and track progress</li>
              <li>• Exclusive member-only offers</li>
            </ul>

            <div className="mt-4">
              <button onClick={fillDemo} className="inline-flex items-center gap-2 px-4 py-2 bg-white text-slate-900 rounded-md font-medium">Fill demo info</button>
            </div>

            <p className="text-sm text-slate-500 mt-6">Already have an account? <Link to="/customer/login" className="text-white underline">Sign in</Link></p>
          </section>

          {/* Right: Register form */}
          <aside className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-2">Sign up</h2>
            <p className="text-sm text-slate-300 mb-4">Create an account to start collecting points.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-slate-200">First name</label>
                  <input
                    id="firstName"
                    {...register('firstName', { required: 'First name is required' })}
                    className={`mt-1 block w-full rounded-md px-3 py-2 bg-slate-900/40 border ${errors.firstName ? 'border-rose-500' : 'border-slate-700'}`}
                    placeholder="Mariam"
                  />
                  {errors.firstName && <p className="mt-1 text-sm text-rose-400">{errors.firstName.message}</p>}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-slate-200">Last name</label>
                  <input
                    id="lastName"
                    {...register('lastName')}
                    className="mt-1 block w-full rounded-md px-3 py-2 bg-slate-900/40 border border-slate-700"
                    placeholder="Tukas"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-200">Email</label>
                <input
                  id="email"
                  type="email"
                  {...register('email', { required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' } })}
                  className={`mt-1 block w-full rounded-md px-3 py-2 bg-slate-900/40 border ${errors.email ? 'border-rose-500' : 'border-slate-700'}`}
                  placeholder="tm@gmail.com"
                />
                {errors.email && <p className="mt-1 text-sm text-rose-400">{errors.email.message}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-200">Phone (optional)</label>
                <input id="phone" {...register('phone')} className="mt-1 block w-full rounded-md px-3 py-2 bg-slate-900/40 border border-slate-700" placeholder="+256700000000" />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-200">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
                    className={`mt-1 block w-full rounded-md px-3 py-2 bg-slate-900/40 border ${errors.password ? 'border-rose-500' : 'border-slate-700'}`}
                    placeholder="Create a password"
                  />
                  <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-slate-300">
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-sm text-rose-400">{errors.password.message}</p>}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-200">Confirm password</label>
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  {...register('confirmPassword', { required: 'Please confirm your password' })}
                  className={`mt-1 block w-full rounded-md px-3 py-2 bg-slate-900/40 border ${errors.confirmPassword ? 'border-rose-500' : 'border-slate-700'}`}
                  placeholder="Repeat password"
                />
                {errors.confirmPassword && <p className="mt-1 text-sm text-rose-400">{errors.confirmPassword.message}</p>}
              </div>

              <div className="flex items-start gap-3">
                <input id="acceptTerms" type="checkbox" {...register('acceptTerms')} className="mt-2 h-4 w-4 rounded border-slate-700 bg-slate-900/40" />
                <label htmlFor="acceptTerms" className="text-sm text-slate-300">I agree to the <Link to="/terms" className="underline">Terms of Service</Link> and <Link to="/privacy" className="underline">Privacy Policy</Link>.</label>
              </div>
              {errors.acceptTerms && <p className="mt-1 text-sm text-rose-400">{errors.acceptTerms.message}</p>}

              {serverError && <div className="text-sm text-rose-400">{serverError}</div>}

              <div className="flex items-center justify-end">
                <button type="submit" disabled={isSubmitting} className={`inline-flex items-center gap-3 px-5 py-2 rounded-md font-semibold shadow-sm ${isSubmitting ? 'bg-slate-600 cursor-wait' : 'bg-emerald-500 hover:bg-emerald-600 text-white'}`}>
                  {isSubmitting ? 'Creating account...' : 'Create account'}
                </button>
              </div>
            </form>

            <div className="mt-4 text-center text-sm text-slate-400">By creating an account you agree to our terms. Already registered? <Link to="/customer/login" className="text-white underline">Sign in</Link></div>
          </aside>
        </div>
      </main>
    </div>
  )
}

export default Register
