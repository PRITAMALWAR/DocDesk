import React from 'react'
import { Link } from 'react-router-dom'

export default function DoctorAvailability(){
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">Add / Edit Availability</h1>
      <div className="bg-white border rounded-2xl p-5 shadow-sm">
        <div className="text-gray-600">Manage your available days & time slots from your profile.</div>
        <Link to="/doctor/profile" className="btn-primary mt-4 inline-block">Go to My Profile</Link>
      </div>
    </div>
  )
}
