import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const brand = import.meta.env.VITE_APP_NAME || 'DocDesk'
const logo = import.meta.env.VITE_BRAND_LOGO

export default function Navbar() {
  const { user, setUser } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  return (
    <header className="bg-white border-b sticky top-0 z-40">
      <div className="container flex items-center justify-between h-16 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          {logo && <img src={logo} alt={brand} className="w-8 h-8 object-contain" />}
          <span className="font-bold text-primary-600 text-lg">{brand}</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 text-sm">
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
        
        {/* Desktop User Menu */}
        <div className="hidden md:flex items-center gap-3">
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
        
        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-gray-600 hover:text-primary-600"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t bg-white">
          <nav className="container px-4 py-4 space-y-3">
            <NavLink to="/" onClick={() => setMobileMenuOpen(false)} className={({isActive})=>`block py-2 ${isActive?"text-primary-600": "text-gray-600"}`}>Home</NavLink>
            <NavLink to="/services" onClick={() => setMobileMenuOpen(false)} className={({isActive})=>`block py-2 ${isActive?"text-primary-600": "text-gray-600"}`}>Services</NavLink>
            {user && user.role === 'doctor' ? (
              <>
                <NavLink to="/doctor" onClick={() => setMobileMenuOpen(false)} className={({isActive})=>`block py-2 ${isActive?"text-primary-600": "text-gray-600"}`}>Doctor Panel</NavLink>
                <NavLink to="/doctor/profile" onClick={() => setMobileMenuOpen(false)} className={({isActive})=>`block py-2 ${isActive?"text-primary-600": "text-gray-600"}`}>Profile</NavLink>
              </>
            ) : (
              <>
                <NavLink to="/book" onClick={() => setMobileMenuOpen(false)} className={({isActive})=>`block py-2 ${isActive?"text-primary-600": "text-gray-600"}`}>Book Appointment</NavLink>
                <NavLink to="/doctors" onClick={() => setMobileMenuOpen(false)} className={({isActive})=>`block py-2 ${isActive?"text-primary-600": "text-gray-600"}`}>Doctor List</NavLink>
                <NavLink to="/appointments" onClick={() => setMobileMenuOpen(false)} className={({isActive})=>`block py-2 ${isActive?"text-primary-600": "text-gray-600"}`}>My Appointments</NavLink>
                <NavLink to="/contact" onClick={() => setMobileMenuOpen(false)} className={({isActive})=>`block py-2 ${isActive?"text-primary-600": "text-gray-600"}`}>Contact</NavLink>
              </>
            )}
            <div className="pt-3 border-t space-y-2">
              {!user ? (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-600">Login</Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="block py-2 btn-primary text-center">Sign up</Link>
                </>
              ) : (
                <button onClick={()=>{setUser(null); setMobileMenuOpen(false)}} className="block w-full text-left py-2 text-gray-600">Logout</button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
