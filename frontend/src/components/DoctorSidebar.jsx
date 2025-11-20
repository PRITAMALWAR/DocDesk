import React, { useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function DoctorSidebar({ isOpen, onClose }){
  const { setUser } = useAuth()
  const nav = useNavigate()
  
  const item = (to, label) => (
    <NavLink 
      to={to} 
      onClick={() => onClose && onClose()}
      className={({isActive})=>`block px-3 py-2 rounded-lg ${isActive? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'}`}
    >
      {label}
    </NavLink>
  )
  
  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    if (isOpen) {
      const handleClickOutside = (e) => {
        if (!e.target.closest('aside') && !e.target.closest('button[aria-label="Open menu"]')) {
          onClose && onClose()
        }
      }
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])
  
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      <aside className={`
        fixed md:sticky inset-y-0 left-0 z-50 md:z-auto
        w-64 md:w-64
        border-r bg-white p-4
        md:top-16
        transform ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        transition-transform duration-300 ease-in-out
        overflow-y-auto
      `}>
        <div className="flex items-center justify-between mb-4 md:mb-3">
          <div className="text-xs uppercase text-gray-500 font-medium">Doctor Menu</div>
          <button
            onClick={onClose}
            className="md:hidden p-1 text-gray-600 hover:text-primary-600"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="space-y-1">
          {item('/doctor/home','Dashboard (Home)')}
          {item('/doctor/appointments','My Appointments')}
          {item('/doctor/requests','Pending Requests')}
          {item('/doctor/patients','Patients List')}
          {item('/doctor/availability','Add / Edit Availability')}
          {item('/doctor/profile','My Profile')}
          {item('/doctor/feedback','Feedback / Ratings')}
          <button 
            onClick={()=>{ setUser(null); nav('/'); onClose && onClose(); }} 
            className="w-full mt-2 text-left px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Logout
          </button>
        </nav>
      </aside>
    </>
  )
}
