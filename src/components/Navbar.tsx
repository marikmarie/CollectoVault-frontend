import React from 'react'
import { Link } from 'react-router-dom'

const Navbar: React.FC = () => {
  return (
    <nav className="w-full py-4 px-6 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center font-bold text-sm">CV</div>
        <div className="text-white font-semibold text-lg">CollectoVolt</div>
      </div>
      <div className="space-x-3">
        <Link to="/customer/login" className="text-neutral hover:text-white">Customer</Link>
        <Link to="/staff/login" className="text-neutral hover:text-white">Staff</Link>
        <Link to="/rewards" className="text-neutral hover:text-white">Rewards</Link>
      </div>
    </nav>
  )
}

export default Navbar
