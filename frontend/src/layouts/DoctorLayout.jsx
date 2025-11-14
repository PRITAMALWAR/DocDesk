import React from 'react'
import { Outlet } from 'react-router-dom'
import DoctorSidebar from '../components/DoctorSidebar'

export default function DoctorLayout(){
  return (
    <div className="container py-6">
      <div className="flex gap-6">
        <DoctorSidebar />
        <section className="flex-1 min-w-0">
          <Outlet />
        </section>
      </div>
    </div>
  )
}
