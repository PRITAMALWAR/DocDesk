import React, { useEffect, useMemo, useState } from 'react'
import { api } from '../../api/client'
import { useAuth } from '../../context/AuthContext'

export default function DoctorPatients(){
  const { user } = useAuth()
  const [appts, setAppts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [q, setQ] = useState('')

  const load = async ()=>{
    setLoading(true); setError('')
    try {
      const data = await api('/api/appointments/me', { token: user?.token })
      setAppts(Array.isArray(data) ? data : [])
    } catch(e){ setError('Failed to load patients') }
    setLoading(false)
  }

  useEffect(()=>{ load() // eslint-disable-next-line
  },[])

  const patients = useMemo(()=>{
    const map = new Map()
    for (const a of appts){
      const p = a?.patient
      if (p && !map.has(p._id)) map.set(p._id, p)
    }
    let arr = Array.from(map.values())
    if (q.trim()) arr = arr.filter(p=> (p.name||'').toLowerCase().includes(q.toLowerCase()) || (p.email||'').toLowerCase().includes(q.toLowerCase()))
    return arr
  }, [appts, q])

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-gray-900">Patients List</h1>
        <div className="flex items-center gap-2">
          <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search patients" className="border rounded-lg px-3 py-2 text-sm"/>
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
            {patients.length===0 && <div className="p-5 text-gray-600">No patients</div>}
            {patients.map(p => (
              <div key={p._id} className="p-4 flex items-center justify-between">
                <div className="min-w-0">
                  <div className="font-medium text-gray-900 truncate">{p.name}</div>
                  <div className="text-sm text-gray-600">{p.email}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
