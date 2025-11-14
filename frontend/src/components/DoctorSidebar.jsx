import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function DoctorSidebar(){
  const { setUser } = useAuth()
  const nav = useNavigate()
  const item = (to, label) => (
    <NavLink to={to} className={({isActive})=>`block px-3 py-2 rounded-lg ${isActive? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'}`}>{label}</NavLink>
  )
  return (
    <aside className="w-full md:w-64 border-r bg-white p-4 md:sticky md:top-16">
      <div className="text-xs uppercase text-gray-500 font-medium mb-3">Doctor Menu</div>
      <nav className="space-y-1">
        {item('/doctor/home','Dashboard (Home)')}
        {item('/doctor/appointments','My Appointments')}
        {item('/doctor/requests','Pending Requests')}
        {item('/doctor/patients','Patients List')}
        {item('/doctor/availability','Add / Edit Availability')}
        {item('/doctor/profile','My Profile')}
        {item('/doctor/feedback','Feedback / Ratings')}
        <button onClick={()=>{ setUser(null); nav('/'); }} className="w-full mt-2 text-left px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50">Logout</button>
      </nav>
    </aside>
  )
}
