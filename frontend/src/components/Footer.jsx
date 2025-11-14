import React from 'react'

const brand = import.meta.env.VITE_APP_NAME || 'DocDesk'

export default function Footer(){
  return (
    <footer className="bg-white border-t mt-16">
      <div className="container py-8 grid md:grid-cols-3 gap-6 text-sm">
        <div>
          <div className="font-bold text-primary-600 text-lg">{brand}</div>
          <p className="text-gray-600 mt-2">Smart doctor appointments, simple and fast.</p>
        </div>
        <div>
          <div className="font-semibold mb-2">Links</div>
          <ul className="space-y-1 text-gray-600">
            <li><a href="/services" className="hover:text-primary-600">Services</a></li>
            <li><a href="/book" className="hover:text-primary-600">Book Appointment</a></li>
            <li><a href="/appointments" className="hover:text-primary-600">All Appointments</a></li>
            <li><a href="/medical-history" className="hover:text-primary-600">Patient Medical History</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2">Contact</div>
          <p className="text-gray-600">support@docdesk.local</p>
        </div>
      </div>
    </footer>
  )
}
