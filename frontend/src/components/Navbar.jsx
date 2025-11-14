import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const brand = import.meta.env.VITE_APP_NAME || 'DocDesk'
const logo = import.meta.env.VITE_BRAND_LOGO

export default function Navbar() {
  const { user, setUser } = useAuth()
  return (
    <header className="bg-white border-b sticky top-0 z-40">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          {logo && <img src={logo} alt={brand} className="w-8 h-8 object-contain" />}
          <span className="font-bold text-primary-600 text-lg">{brand}</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <NavLink to="/" className={({isActive})=>isActive?"text-primary-600": "text-gray-600 hover:text-primary-600"}>Home</NavLink>
          <NavLink to="/services" className={({isActive})=>isActive?"text-primary-600": "text-gray-600 hover:text-primary-600"}>Services</NavLink>
          {user && user.role === 'doctor' ? null : (
            <>
              <NavLink to="/book" className={({isActive})=>isActive?"text-primary-600": "text-gray-600 hover:text-primary-600"}>Book Appointment</NavLink>
              <NavLink to="/doctors" className={({isActive})=>isActive?"text-primary-600": "text-gray-600 hover:text-primary-600"}>Doctor List</NavLink>
              <NavLink to="/contact" className={({isActive})=>isActive?"text-primary-600": "text-gray-600 hover:text-primary-600"}>Contact</NavLink>
            </>
          )}
        </nav>
        <div className="flex items-center gap-3">
          {!user ? (
            <>
              <Link to="/login" className="text-sm text-gray-600 hover:text-primary-600">Login</Link>
              <Link to="/signup" className="btn-primary text-sm">Sign up</Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              {user.role === 'doctor' ? (
                <>
                  <NavLink to="/doctor" className={({isActive})=>isActive?"text-primary-600 font-medium":"text-sm text-gray-600 hover:text-primary-600"}>Doctor Panel</NavLink>
                  <NavLink to="/doctor/profile" className={({isActive})=>isActive?"text-primary-600 font-medium":"text-sm text-gray-600 hover:text-primary-600"}>Profile</NavLink>
                </>
              ) : (
                <>
                  <NavLink to="/appointments" className={({isActive})=>isActive?"text-primary-600": "text-sm text-gray-600 hover:text-primary-600"}>My Appointments</NavLink>
                </>
              )}
              <button onClick={()=>setUser(null)} className="text-sm text-gray-600 hover:text-primary-600">Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
