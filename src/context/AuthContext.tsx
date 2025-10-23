import React, { createContext, useContext, useState, type ReactNode, useEffect } from 'react'
import { customers as initialCustomers, staff as initialStaff } from '../data/dummy'

type User = {
  points: number;
  firstName?: string; id: string; name: string; email?: string; role: 'customer' | 'staff' | null 
}

type AuthContextType = {
  user: User | null
  loginCustomer: (email: string) => void
  loginStaff: (email: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export const AuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem('cv_user')
      return raw ? JSON.parse(raw) : null
    } catch { return null }
  })

  useEffect(() => {
    if (user) localStorage.setItem('cv_user', JSON.stringify(user))
    else localStorage.removeItem('cv_user')
  }, [user])

  const loginCustomer = (email: string) => {
    const c = initialCustomers.find(x => x.email === email) || initialCustomers[0]
    setUser({ id: c.id, name: c.name, email: c.email, role: 'customer', points: c.points ?? 0 })
  }

  const loginStaff = (email: string) => {
    const s = initialStaff.find(x => x.email === email) || initialStaff[0]
    setUser({ id: s.id, name: s.name, email: s.email, role: 'staff', points: s.points ?? 0 })
  }
 
  const logout = () => setUser(null)

  return <AuthContext.Provider value={{ user, loginCustomer, loginStaff, logout }}>{children}</AuthContext.Provider>
}
