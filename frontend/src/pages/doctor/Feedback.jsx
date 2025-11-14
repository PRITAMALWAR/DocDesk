import React, { useEffect, useMemo, useState } from 'react'
import { api } from '../../api/client'
import { useAuth } from '../../context/AuthContext'

export default function DoctorFeedback(){
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [items, setItems] = useState([])
  const [avg, setAvg] = useState(0)

  const load = async ()=>{
    setLoading(true); setError('')
    try{
      const doc = await api('/api/doctors/me', { token: user?.token })
      const list = await api(`/api/feedback/doctor/${doc._id}`)
      setItems(Array.isArray(list) ? list : [])
    }catch(e){ setError('Failed to load feedback') }
    setLoading(false)
  }

  useEffect(()=>{ load() // eslint-disable-next-line
  },[])

  useEffect(()=>{
    if (!items.length) { setAvg(0); return }
    const a = items.reduce((s,f)=> s + (f.rating||0), 0) / items.length
    setAvg(Math.round(a*10)/10)
  }, [items])

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-gray-900">Feedback / Ratings</h1>
        <button className="px-3 py-2 border rounded-lg text-sm" onClick={load}>Refresh</button>
      </div>
      {loading ? (
        <div className="bg-white border rounded-2xl p-5 shadow-sm">Loading...</div>
      ) : error ? (
        <div className="bg-white border rounded-2xl p-5 shadow-sm text-red-600">{error}</div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white border rounded-2xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Average Rating</div>
              <div className="mt-1 text-3xl font-semibold">{avg || '-'}<span className="text-base text-gray-500">/5</span></div>
            </div>
            <div className="text-sm text-gray-600">{items.length} feedback(s)</div>
          </div>
          <div className="bg-white border rounded-2xl p-0 overflow-hidden shadow-sm">
            <div className="divide-y">
              {items.length===0 && <div className="p-5 text-gray-600">No feedback yet</div>}
              {items.map(f => (
                <div key={f._id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-gray-900">{f?.patient?.name || 'Patient'}</div>
                    <div className="text-sm text-gray-700">{f.rating}/5</div>
                  </div>
                  {f.comments && <div className="mt-1 text-gray-700">{f.comments}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
