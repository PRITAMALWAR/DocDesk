import React, { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../api/client'

export default function DoctorRequests(){
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async ()=>{
    setLoading(true); setError('')
    try {
      const data = await api('/api/appointments/me', { token: user?.token })
      setItems(Array.isArray(data)? data : [])
    } catch (e) {
      setError('Failed to load requests')
    }
    setLoading(false)
  }

  const pending = useMemo(()=> items.filter(a=> a.status==='pending'), [items])

  useEffect(()=>{ load() // eslint-disable-next-line
  },[])

  const act = async (id, status)=>{
    try{
      await api(`/api/appointments/${id}/status`, { method: 'PATCH', token: user?.token, body: { status } })
      await load()
    }catch(e){ /* ignore */ }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-gray-900">Pending Requests</h1>
        <button className="px-3 py-2 border rounded-lg text-sm" onClick={load}>Refresh</button>
      </div>
      {loading ? (
        <div className="bg-white border rounded-2xl p-5 shadow-sm">Loading...</div>
      ) : error ? (
        <div className="bg-white border rounded-2xl p-5 shadow-sm text-red-600">{error}</div>
      ) : (
        <div className="bg-white border rounded-2xl p-0 overflow-hidden shadow-sm">
          <div className="divide-y">
            {pending.length===0 && <div className="p-5 text-gray-600">No pending requests</div>}
            {pending.map(ap => (
              <div key={ap._id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-gray-900 truncate">{ap?.patient?.name || 'Patient'}</div>
                  <div className="text-sm text-gray-600">{ap.date?.slice(0,10)} · {ap.time}</div>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg bg-green-600 text-white text-sm hover:bg-green-700" onClick={()=>act(ap._id,'confirmed')}>Approve</button>
                  <button className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700" onClick={()=>act(ap._id,'cancelled')}>Reject</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
