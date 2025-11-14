import React, { useEffect, useState } from 'react'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'

const Badge = ({ status }) => {
  const map = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return <span className={`px-2 py-1 rounded text-xs font-medium ${map[status] || 'bg-gray-100 text-gray-800'}`}>{status}</span>
}

export default function AllAppointments(){
  const { user } = useAuth()
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const [docMap, setDocMap] = useState({})

  useEffect(()=>{
    const load = async ()=>{
      try{
        const [apps, docs] = await Promise.all([
          api('/api/appointments/me', { token: user?.token }),
          api('/api/doctors')
        ])
        setList(Array.isArray(apps) ? apps : [])
        const map = {}
        if (Array.isArray(docs)) {
          for (const d of docs) map[d._id] = d.user?.name || d.name || d._id
        }
        setDocMap(map)
      }catch(e){ setErr('Failed to load appointments') }
      setLoading(false)
    }
    load()
  },[])

  return (
    <div className="container py-10">
      <h2 className="text-2xl font-bold mb-4">My Appointments</h2>
      {err && <div className="text-sm text-red-600">{err}</div>}
      {loading ? <div>Loading...</div> : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map(ap => (
            <div key={ap._id} className="card">
              <div className="flex items-center justify-between">
                <div className="font-semibold">{(ap.date || '').slice(0,10)} · {ap.time}</div>
                <Badge status={ap.status} />
              </div>
              <div className="text-sm text-gray-700 mt-2">
                <div>
                  <span className="text-gray-500">Doctor:</span> {(() => {
                    const d = ap.doctor
                    if (!d) return '—'
                    if (typeof d === 'string') return docMap[d] || d
                    // When doctor is an object, prefer mapped name via its _id
                    return docMap[d._id] || d.user?.name || d.name || d._id || '—'
                  })()}
                </div>
                <div><span className="text-gray-500">Status:</span> {ap.status}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
