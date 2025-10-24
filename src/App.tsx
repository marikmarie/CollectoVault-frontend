import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import CustomerLogin from './pages/customer/Login'
import StaffLogin from './pages/staff/StaffLogin'
import CustomerDashboard from './features/customer/CustomerDashboard'
import StaffDashboard from './pages/staff/StaffDashboard'
import RewardsCatalog from './features/customer/RewardsCatalog'
import RedeemReward from './features/customer/RedeemReward'
import PointsAward from './features/customer/PointsAward'
import AdminRewards from './pages/AdminRewards'
import TransactionHistory from './features/customer/TransactionHistory'
import { AuthProvider } from './context/AuthContext'
import { DataProvider } from './context/DataContext'
import './index.css'
import Register from './pages/customer/Register'
import AppRoutes from './routes/AppRoutes'

const App: React.FC = () => {
  return (
    <AppRoutes />
  );
}

export default App
