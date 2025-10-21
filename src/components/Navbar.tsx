import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar: React.FC = () => {
  const { user, logout } = useAuth()
  return (
    <nav className="w-full py-4 px-6 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center font-bold text-sm">CV</div>
        <div className="text-white font-semibold text-lg">CollectoVolt</div>
      </div>
      <div className="space-x-3 flex items-center">
        <Link to="/rewards" className="text-neutral hover:text-white">Rewards</Link>
        {!user && <>
          <Link to="/customer/login" className="text-neutral hover:text-white">Customer</Link>
          <Link to="/staff/login" className="text-neutral hover:text-white">Staff</Link>
        </>}
        {user && <div className="flex items-center gap-3">
          <div className="text-neutral text-sm">Hello, <span className="text-white font-semibold">{user.name}</span></div>
          <button onClick={logout} className="px-3 py-1 bg-primary rounded text-white">Logout</button>
        </div>}
      </div>
    </nav>
  )
}

export default Navbar
