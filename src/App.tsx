import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import CustomerLogin from './pages/CustomerLogin'
import StaffLogin from './pages/StaffLogin'
import CustomerDashboard from './pages/CustomerDashboard'
import StaffDashboard from './pages/StaffDashboard'
import RewardsCatalog from './pages/RewardsCatalog'
import RedeemReward from './pages/RedeemReward'
import PointsAward from './pages/PointsAward'
import AdminRewards from './pages/AdminRewards'
import TransactionHistory from './pages/TransactionHistory'
import { AuthProvider } from './context/AuthContext'
import { DataProvider } from './context/DataContext'
import './index.css'
import Register from './pages/Register'

const App: React.FC = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/customer/login" element={<CustomerLogin />} />
          <Route path="/customer/register" element={<Register />} />
          <Route path="/staff/login" element={<StaffLogin />} />
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />
          <Route path="/staff/dashboard" element={<StaffDashboard />} />
          <Route path="/rewards" element={<RewardsCatalog />} />
          <Route path="/redeem" element={<RedeemReward />} />
          <Route path="/award" element={<PointsAward />} />
          <Route path="/admin/rewards" element={<AdminRewards />} />
          <Route path="/customer/history" element={<TransactionHistory />} />
        </Routes>
      </DataProvider>
    </AuthProvider>
  )
}

// export default function App() {
//   return (
//     <div className="min-h-screen bg-blue-600 flex items-center justify-center">
//       <h1 className="text-5xl font-bold text-white">Tailwind is working 🎉</h1>
//     </div>
//   );
// }

export default App
