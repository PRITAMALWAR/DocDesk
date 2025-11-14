import React, { useEffect, useState } from 'react'
import { api } from '../../api/client'
import { useAuth } from '../../context/AuthContext'

export default function DoctorDashboard(){
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [kpi, setKpi] = useState({ total: 0, patients: 0, earnings: 0, rating: 0 })

  const load = async () => {
    setLoading(true); setError('')
    try {
      const doc = await api('/api/doctors/me', { token: user?.token })
      const appts = await api('/api/appointments/me', { token: user?.token })
      const total = Array.isArray(appts) ? appts.length : 0
      const patients = Array.isArray(appts) ? new Set(appts.map(a=>a?.patient?._id)).size : 0
      // Optional: compute simple earnings from confirmed/completed count * flat rate (placeholder)
      const completed = Array.isArray(appts) ? appts.filter(a=> a.status==='completed' || a.status==='confirmed').length : 0
      const earnings = completed * 500 // placeholder amount per appointment
      // Feedback average
      let rating = 0
      try {
        const fbs = await api(`/api/feedback/doctor/${doc._id}`)
        if (Array.isArray(fbs) && fbs.length) {
          rating = Math.round((fbs.reduce((s,f)=> s + (f.rating||0),0) / fbs.length) * 10)/10
        }
      } catch {}
      setKpi({ total, patients, earnings, rating })
    } catch (e) {
      setError('Failed to load dashboard')
    }
    setLoading(false)
  }

  useEffect(()=>{ load() // eslint-disable-next-line
  },[])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <button className="px-3 py-2 border rounded-lg text-sm" onClick={load}>Refresh</button>
      </div>
      {loading ? (
        <div className="bg-white border rounded-2xl p-5 shadow-sm">Loading...</div>
      ) : error ? (
        <div className="bg-white border rounded-2xl p-5 shadow-sm text-red-600">{error}</div>
      ) : (
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-white border rounded-2xl p-5 shadow-sm">
            <div className="text-sm text-gray-500">Total Appointments</div>
            <div className="mt-2 text-3xl font-semibold">{kpi.total}</div>
          </div>
          <div className="bg-white border rounded-2xl p-5 shadow-sm">
            <div className="text-sm text-gray-500">Patients</div>
            <div className="mt-2 text-3xl font-semibold">{kpi.patients}</div>
          </div>
          <div className="bg-white border rounded-2xl p-5 shadow-sm">
            <div className="text-sm text-gray-500">Earnings</div>
            <div className="mt-2 text-3xl font-semibold">₹{kpi.earnings}</div>
          </div>
          <div className="bg-white border rounded-2xl p-5 shadow-sm">
            <div className="text-sm text-gray-500">Avg Rating</div>
            <div className="mt-2 text-3xl font-semibold">{kpi.rating || '-'}<span className="text-base text-gray-500">/5</span></div>
          </div>
        </div>
      )}
    </div>
  )
}
