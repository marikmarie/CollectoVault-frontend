import React, { createContext, useContext, useState, type ReactNode, useEffect } from 'react'
import { customers as initialCustomers, staff as initialStaff } from '../data/dummy'

type User = {
  points: number
  firstName?: string
  lastName?: string
  id: string
  name: string
  email?: string
  role: 'customer' | 'vendor' | 'staff'|'admin' | null
  avatarUrl?: string | null
}

type RegisterPayload = {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  password: string;
};

type AuthContextType = {
  user: User | null
  isAuthenticated?: boolean
  loginCustomer: (email: string) => User
  loginStaff: (email: string) => void
  logout: () => void
  register: (payload: RegisterPayload) => Promise<User>;
  
  updateProfile: (patch: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem('cv_user')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (user) localStorage.setItem('cv_user', JSON.stringify(user))
    else localStorage.removeItem('cv_user')
  }, [user])

  // const loginCustomer = (email: string) => {
  //   const c = initialCustomers.find(x => x.email === email) || initialCustomers[0]
  //   setUser({ id: c.id, name: c.name, email: c.email, role: 'customer', points: c.points ?? 0, avatarUrl: c.avatarUrl ?? null })
  //   return c;
  // }

const loginCustomer = (email: string): User => {
  const c = initialCustomers.find(x => x.email === email) || initialCustomers[0]
  const user: User = {
    id: c.id,    name: c.name,    email: c.email,
    role: 'customer',    points: c.points ?? 0,    avatarUrl: c.avatarUrl ?? null
  }
  setUser(user)
  return user
}

  const loginStaff = (email: string) => {
    const s = initialStaff.find(x => x.email === email) || initialStaff[0]
    setUser({ id: s.id, name: s.name, email: s.email, role: 'staff', points: s.points ?? 0, avatarUrl: s.avatarUrl ?? null })
  }

  const logout = () => setUser(null)
  //const updateProfile = (patch: Partial<User>) => {
    const updateProfile = () => {
  
      //const next = { ...(user ?? {}), ...patch };
     // setUser(next);
      try {
        //localStorage.setItem(KEY_USER, JSON.stringify(next));
      } catch {}
    };
  
  const register = async (payload: RegisterPayload): Promise<User> => {
    // Implement your registration logic here
    const newUser: User = {
      id: Date.now().toString(),
      name: `${payload.firstName} ${payload.lastName || ''}`,
      email: payload.email,
      role: 'customer',
      points: 0
    };
    setUser(newUser);
    return newUser;
  };

  return <AuthContext.Provider value={{ user, loginCustomer, loginStaff, logout, updateProfile, register }}>{children}</AuthContext.Provider>
}
