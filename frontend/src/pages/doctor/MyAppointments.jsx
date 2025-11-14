import React, { useEffect, useMemo, useState } from 'react'
import { api } from '../../api/client'
import { useAuth } from '../../context/AuthContext'

const Badge = ({ status }) => {
  const map = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return <span className={`px-2 py-1 rounded text-xs font-medium ${map[status] || 'bg-gray-100 text-gray-800'}`}>{status}</span>
}

export default function DoctorMyAppointments(){
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')

  const load = async () => {
    setLoading(true); setError('')
    try {
      const data = await api('/api/appointments/me', { token: user?.token })
      setItems(Array.isArray(data) ? data : [])
    } catch (e) {
      setError('Failed to load appointments')
    }
    setLoading(false)
  }

  useEffect(()=>{ load() // eslint-disable-next-line
  },[])

  const shown = useMemo(()=> items.filter(a => filter==='all' ? true : a.status===filter), [items, filter])

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-gray-900">My Appointments</h1>
        <div className="flex items-center gap-2">
          <select value={filter} onChange={(e)=>setFilter(e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
            {['all','pending','confirmed','completed','cancelled'].map(s=> <option key={s} value={s}>{s}</option>)}
          </select>
          <button className="px-3 py-2 border rounded-lg text-sm" onClick={load}>Refresh</button>
        </div>
      </div>
      {loading ? (
        <div className="bg-white border rounded-2xl p-5 shadow-sm">Loading...</div>
      ) : error ? (
        <div className="bg-white border rounded-2xl p-5 shadow-sm text-red-600">{error}</div>
      ) : (
        <div className="bg-white border rounded-2xl p-0 overflow-hidden shadow-sm">
          <div className="divide-y">
            {shown.length === 0 && <div className="p-5 text-gray-600">No appointments</div>}
            {shown.map(ap => (
              <div key={ap._id} className="p-4 flex items-center justify-between">
                <div className="min-w-0">
                  <div className="font-medium text-gray-900 truncate">{ap?.patient?.name || 'Patient'}</div>
                  <div className="text-sm text-gray-600">{ap.date?.slice(0,10)} · {ap.time}</div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge status={ap.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
