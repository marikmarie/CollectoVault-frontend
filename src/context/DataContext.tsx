import React, { createContext, useContext, useState, type ReactNode, useEffect } from 'react'
import { customers as initialCustomers, rewards as initialRewards, transactions as initialTransactions, type Customer, type Reward } from '../data/dummy'

type DataContextType = {
  customers: Customer[]
  rewards: Reward[]
  transactions: any[]
  awardPoints: (customerId: string, points: number, note?: string) => void
  redeemReward: (customerId: string, rewardId: string) => { success: boolean; message: string }
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export const useData = () => {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}

export const DataProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const raw = localStorage.getItem('cv_customers')
      return raw ? JSON.parse(raw) : initialCustomers
    } catch { return initialCustomers }
  })
  //const [rewards, setRewards] = useState<Reward[]>(() => {
     const [rewards] = useState<Reward[]>(() => {
    try {
      const raw = localStorage.getItem('cv_rewards')
      return raw ? JSON.parse(raw) : initialRewards
    } catch { return initialRewards }
  })
  const [transactions, setTransactions] = useState<any[]>(() => {
    try {
      const raw = localStorage.getItem('cv_transactions')
      return raw ? JSON.parse(raw) : initialTransactions
    } catch { return initialTransactions }
  })

  useEffect(() => { localStorage.setItem('cv_customers', JSON.stringify(customers)) }, [customers])
  useEffect(() => { localStorage.setItem('cv_rewards', JSON.stringify(rewards)) }, [rewards])
  useEffect(() => { localStorage.setItem('cv_transactions', JSON.stringify(transactions)) }, [transactions])

  const awardPoints = (customerId: string, points: number, note = 'Awarded points') => {
    setCustomers(prev => prev.map(c => c.id === customerId ? { ...c, points: c.points + points } : c))
    const tx = { id: 'TX' + Date.now(), customerId, type: 'earn', points, date: new Date().toISOString().slice(0,10), note }
    setTransactions(prev => [tx, ...prev])
  }

  const redeemReward = (customerId: string, rewardId: string) => {
    const customer = customers.find(c => c.id === customerId)
    const reward = rewards.find(r => r.id === rewardId)
    if (!customer || !reward) return { success: false, message: 'Missing data' }
    if (customer.points < reward.points) return { success: false, message: 'Insufficient points' }

    setCustomers(prev => prev.map(c => c.id === customerId ? { ...c, points: c.points - reward.points } : c))
    const tx = { id: 'TX' + Date.now(), customerId, type: 'redeem', points: -reward.points, date: new Date().toISOString().slice(0,10), note: 'Redeemed: ' + reward.title }
    setTransactions(prev => [tx, ...prev])
    return { success: true, message: 'Redeemed successfully' }
  }

  return <DataContext.Provider value={{ customers, rewards, transactions, awardPoints, redeemReward }}>{children}</DataContext.Provider>
}
