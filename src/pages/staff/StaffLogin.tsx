import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import Navbar from '../../components/layout/Navbar'
import { useAuth } from '../../context/AuthContext'

type Form = {
  email: string
  password: string
  remember?: boolean
}

const StaffLogin: React.FC = () => {
  const navigate = useNavigate()
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<Form>({
    defaultValues: { email: '', password: '', remember: true }
  })
  const { loginStaff } = useAuth()
  const [serverError, setServerError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const onSubmit = async (data: Form) => {
    setServerError(null)
    try {
      // call loginStaff from context; adapt to your actual signature
      await (loginStaff as any)?.(data.email, data.password)
      navigate('/staff/dashboard')
    } catch (e: any) {
      setServerError(e?.message || 'Login failed. Please verify your credentials.')
    }
  }

  const fillDemo = () => {
    setValue('email', 'staff@example.com')
    setValue('password', 'password')
  }

  return (
    <div className="min-h-screen bg-linear-to-b rgba from-slate-900 via-slate-800 to-slate-900 text-white">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left: Info / Branding */}
          <section className="space-y-6">
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
              Staff Portal — Manage rewards & customers
            </h1>
            <p className="text-slate-300">
              Access staff tools to award points, manage redemptions, and view member activity. Secure sign-in for store managers and support staff.
            </p>

            <div className="flex gap-3 items-center">
              <button
                onClick={fillDemo}
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-slate-900 rounded-md shadow-sm hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/40"
              >
                Use Demo Staff
              </button>

              <Link to="/customer/login" className="text-sm text-slate-300 hover:underline ml-2">
                Customer login
              </Link>
            </div>

            <ul className="mt-4 text-sm text-slate-400 space-y-2">
              <li>• Quick access to staff dashboard and member management</li>
              <li>• Secure role-based access for managers and clerks</li>
            </ul>
          </section>

          {/* Right: Login Card */}
          <aside className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-2">Staff Login</h2>
            <p className="text-sm text-slate-300 mb-4">Sign in with your staff email to access the management console.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-200">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className={`mt-1 block w-full rounded-md border px-3 py-2 placeholder:text-slate-400 bg-slate-900/40
                    ${errors.email ? 'border-rose-500' : 'border-slate-700'} focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-white/30`}
                  placeholder="you@company.com"
                  aria-invalid={errors.email ? 'true' : 'false'}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Enter a valid email'
                    }
                  })}
                  defaultValue="staff@example.com"
                />
                {errors.email && (
                  <p role="alert" className="mt-1 text-sm text-rose-400">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-200">
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className={`mt-1 block w-full rounded-md border px-3 py-2 bg-slate-900/40 placeholder:text-slate-400
                      ${errors.password ? 'border-rose-500' : 'border-slate-700'} focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-white/30`}
                    placeholder="Your password"
                    aria-invalid={errors.password ? 'true' : 'false'}
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 4, message: 'Password must be at least 4 characters' }
                    })}
                    defaultValue="password"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-slate-300 hover:text-white"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>

                {errors.password && (
                  <p role="alert" className="mt-1 text-sm text-rose-400">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember & forgot */}
              <div className="flex items-center justify-between">
                <label className="inline-flex items-center gap-2 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    {...register('remember')}
                    className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-white focus:ring-0"
                  />
                  Remember me
                </label>

                <Link to="/staff/forgot-password" className="text-sm text-slate-300 hover:underline">
                  Forgot password?
                </Link>
              </div>

              {/* Server error */}
              {serverError && (
                <div role="alert" className="text-sm text-rose-400">
                  {serverError}
                </div>
              )}

              {/* Submit */}
              <div className="flex items-center justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`inline-flex items-center gap-3 px-5 py-2 rounded-md font-semibold shadow-sm
                    ${isSubmitting ? 'bg-slate-600 cursor-wait' : 'bg-green-500 hover:bg-green-600'}`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25" />
                        <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="4" />
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    'Login'
                  )}
                </button>
              </div>
            </form>

            <div className="mt-4 text-center text-sm text-slate-400">
              Need help? <Link to="/support" className="text-white underline">Contact support</Link>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}

export default StaffLogin
