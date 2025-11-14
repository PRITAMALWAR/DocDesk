import React, { useEffect, useMemo, useState } from 'react'
import { api } from '../api/client'
import { Link } from 'react-router-dom'

const SPECIALTIES = ['Cardiologist','Dermatologist','Dentist','Neurologist']

export default function DoctorList(){
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [items, setItems] = useState([])
  const [q, setQ] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [minRating, setMinRating] = useState('')

  const load = async ()=>{
    setLoading(true); setError('')
    try{
      const params = new URLSearchParams()
      if (q.trim()) params.set('q', q.trim())
      if (specialty) params.set('specialty', specialty)
      if (minRating) params.set('minRating', minRating)
      const data = await api(`/api/doctors${params.toString()?`?${params.toString()}`:''}`)
      setItems(Array.isArray(data) ? data : [])
    }catch(e){ setError('Failed to load doctors') }
    setLoading(false)
  }

  useEffect(()=>{ load() // eslint-disable-next-line
  },[])

  const clear = ()=>{ setQ(''); setSpecialty(''); setMinRating(''); setTimeout(load,0) }

  const filteredItems = useMemo(() => {
    const rx = q.trim() ? new RegExp(q.trim(), 'i') : null
    return rx ? items.filter(d => rx.test(d?.user?.name || '') || rx.test(d?.specialty || '')) : items
  }, [items, q])

  return (
    <div>
      <section className="bg-white border-b">
        <div className="container py-8">
          <h1 className="text-3xl font-bold">Find a Doctor</h1>
          <p className="text-gray-600 mt-2">Filter by specialization or rating, or search by name/specialty.</p>
        </div>
      </section>

      <section className="bg-gray-50">
        <div className="container py-6">
          <div className="grid md:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-700">Search</label>
              <input
                value={q}
                onChange={(e)=>setQ(e.target.value)}
                onKeyDown={(e)=>{ if(e.key==='Enter'){ e.preventDefault(); load() } }}
                placeholder="Search doctors or specialties"
                className="mt-1 w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Specialty</label>
              <select value={specialty} onChange={(e)=>setSpecialty(e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2">
                <option value="">All</option>
                {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700">Min Rating</label>
              <select value={minRating} onChange={(e)=>setMinRating(e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2">
                <option value="">Any</option>
                {[1,2,3,4].map(r => <option key={r} value={r}>{r}+</option>)}
              </select>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <button className="btn-primary" onClick={load}>Apply Filters</button>
            <button className="px-4 py-2 border rounded-lg" onClick={clear}>Clear</button>
          </div>
        </div>
      </section>

      <section>
        <div className="container py-8">
          {loading ? (
            <div className="card p-5">Loading...</div>
          ) : error ? (
            <div className="card p-5 text-red-600">{error}</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.length===0 && <div className="col-span-full text-gray-600">No doctors found</div>}
              {filteredItems.map(d => (
                <div key={d._id} className="bg-white border rounded-2xl p-5 shadow-sm flex flex-col">
                  <div className="flex items-center gap-4">
                    <img src={d.profilePhoto || 'https://via.placeholder.com/64'} alt="doc" className="w-16 h-16 rounded-full object-cover border"/>
                    <div className="min-w-0">
                      <div className="font-semibold text-gray-900 truncate">{d?.user?.name || 'Doctor'}</div>
                      <div className="text-sm text-gray-600 truncate">{d.specialty}</div>
                      <div className="text-xs text-gray-500">{typeof d.rating==='number' ? `${Math.round(d.rating*10)/10}/5` : '-'} · {d.ratingCount||0} reviews</div>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-700 space-y-1">
                    {d.hospitalName && <div>Hospital: {d.hospitalName}</div>}
                    {d.clinicAddress && <div>Clinic: {d.clinicAddress}</div>}
                    {Array.isArray(d.languages) && d.languages.length>0 && <div>Languages: {d.languages.join(', ')}</div>}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Link to="/book" className="btn-primary">Book Appointment</Link>
                    <Link to={`/doctors/${d._id}`} className="px-4 py-2 border rounded-lg text-sm">View Profile</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
