import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import DoctorSidebar from '../components/DoctorSidebar'

export default function DoctorLayout(){
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  return (
    <div className="container py-4 sm:py-6 px-4 sm:px-6">
      <div className="flex gap-4 sm:gap-6">
        <DoctorSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <section className="flex-1 min-w-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden mb-4 p-2 text-gray-600 hover:text-primary-600 border rounded-lg"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Outlet />
        </section>
      </div>
    </div>
  )
}
