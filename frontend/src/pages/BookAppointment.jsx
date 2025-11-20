import React, { useEffect, useMemo, useState } from 'react'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'
import Toast from '../components/Toast'
import { useNavigate } from 'react-router-dom'

const heroImg = 'https://images.unsplash.com/photo-1673865641073-4479f93a7776?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'

export default function BookAppointment(){
  const { user } = useAuth()
  const navigate = useNavigate()
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ doctorId: '', date: '', time: '', weekday: '' })
  const [message, setMessage] = useState('')
  const [kind, setKind] = useState('info')
  const [submitting, setSubmitting] = useState(false)
  const [toastMsg, setToastMsg] = useState('')
  const [toastKind, setToastKind] = useState('success')
  const today = new Date().toISOString().slice(0,10)

  const weekdayShort = (dateStr) => {
    const m = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/.exec(dateStr)
    if (!m) return ''
    const [_, y, mo, d] = m
    const dt = new Date(Number(y), Number(mo)-1, Number(d))
    return ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][dt.getDay()]
  }

  useEffect(()=>{
    const load = async ()=>{
      try{
        const data = await api('/api/doctors')
        setDoctors(Array.isArray(data) ? data : [])
      }catch(e){ setMessage('Failed to load doctors'); setKind('error') }
      setLoading(false)
    }
    load()
  },[])

  const submit = async (e)=>{
    e.preventDefault()
    setMessage('')
    // Basic validation
    if (!form.doctorId) { setMessage('Please select a doctor'); setKind('error'); return }
    if (!form.date) { setMessage('Please select a date'); setKind('error'); return }
    const derived = weekdayShort(form.date)
    const chosenWeekday = form.weekday || derived
    if (!chosenWeekday) { setMessage('Please select a weekday'); setKind('error'); return }
    if (derived && chosenWeekday && derived !== chosenWeekday) { setMessage('Selected weekday does not match the chosen date'); setKind('error'); return }
    if (!form.time) { setMessage('Please select a time'); setKind('error'); return }
    try{
      setSubmitting(true)
      await api('/api/appointments', { method: 'POST', body: { ...form, weekday: chosenWeekday }, token: user?.token })
      setMessage('Appointment booked successfully')
      setKind('success')
      setToastMsg('Appointment booked successfully')
      setToastKind('success')
      setForm({ doctorId: '', date: '', time: '', weekday: '' })
      navigate('/appointments')
    }catch(e){
      const errMsg = (() => {
        try{ const j = JSON.parse(e.message); return j.message || 'Booking failed' }catch{ return 'Booking failed' }
      })()
      setMessage(errMsg)
      setKind('error')
      setToastMsg(errMsg)
      setToastKind('error')
    } finally { setSubmitting(false) }
  }

  const selectedDoctor = doctors.find(d => d._id === form.doctorId)
  const slotsForWeekday = useMemo(() => {
    if (!selectedDoctor) return []
    const effectiveWeekday = (form.weekday || (form.date ? weekdayShort(form.date) : '') || '').toLowerCase()
    if (!effectiveWeekday) return []
    const entry = (selectedDoctor.availability||[]).find(a => String(a.day).slice(0,3).toLowerCase() === effectiveWeekday)
    return Array.isArray(entry?.slots) ? entry.slots : []
  }, [selectedDoctor, form.weekday, form.date])
  const weekdayOptions = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
  const selectedWeekday = useMemo(() => form.weekday || (form.date ? weekdayShort(form.date) : ''), [form.weekday, form.date])

  // When slot list changes, clear selected time if it is no longer valid
  useEffect(() => {
    setForm(f => ({ ...f, time: slotsForWeekday.includes(f.time) ? f.time : '' }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slotsForWeekday.join(',')])

  // Clear banner on changes
  useEffect(()=>{ if (message) setMessage('') }, [form.doctorId, form.date, form.weekday, form.time])

  return (
    <div>
      <Toast kind={toastKind} message={toastMsg} onClose={()=> setToastMsg('')} />
      {/* Hero */}
      <section className="bg-white border-b">
        <div className="container py-12 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold">Book an Appointment</h2>
            <p className="text-gray-600 mt-2">Choose a doctor, pick a date and time, and you are done.</p>
            <ul className="mt-4 text-gray-700 space-y-1 text-sm">
              <li>• Verified doctors across specialties</li>
              <li>• Real-time availability and instant confirmation</li>
              <li>• Reminders via email</li>
            </ul>
          </div>
          <div className="h-56 md:h-72 rounded-xl overflow-hidden shadow">
            <img src={heroImg} alt="appointment" className="w-full h-full object-cover"/>
          </div>
        </div>
      </section>

      {/* Form */}
      <section>
        <div className="container py-10">
          {message && (
            <div className={`mb-5 text-sm rounded p-3 border ${kind==='success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : kind==='error' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>{message}</div>
          )}
          {user && user.role !== 'patient' && (
            <div className="mb-4 text-sm rounded p-3 border bg-amber-50 text-amber-800 border-amber-200">Only patients can book appointments. Please log in as a patient.</div>
          )}
          <form onSubmit={submit} className="card p-4 sm:p-6 grid md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label className="block text-sm text-gray-700">Doctor</label>
              <select value={form.doctorId} onChange={(e)=>setForm(f=>({...f, doctorId: e.target.value, time: '' }))} className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="">Select a doctor</option>
                {!loading && doctors.map(d=> (
                  <option key={d._id} value={d._id}>{d.user?.name} · {d.specialty}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm text-gray-700">Date</label>
              <input type="date" min={today} value={form.date} onChange={(e)=>{
                const v = e.target.value
                const autoW = v ? weekdayShort(v) : ''
                setForm(f=>({...f, date: v, time: '', weekday: autoW }))
              }} className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-primary-500"/>
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm text-gray-700">Weekday</label>
              <div className="mt-1 flex flex-wrap gap-2">
                {weekdayOptions.map(dy => {
                  const active = form.weekday === dy
                  return (
                    <button type="button" key={dy} onClick={()=> setForm(f=>({...f, weekday: dy, time: ''}))} className={`px-2 sm:px-3 py-1 rounded-full border text-xs sm:text-sm ${active ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'}`}>{dy}</button>
                  )
                })}
              </div>
              {form.date && form.weekday && weekdayShort(form.date) !== form.weekday && (
                <div className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1">Selected weekday does not match the chosen date.</div>
              )}
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm text-gray-700">Time</label>
              <select
                value={form.time}
                onChange={(e)=>setForm(f=>({...f, time: e.target.value}))}
                className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={!selectedDoctor || !(form.weekday || form.date) || slotsForWeekday.length===0}
              >
                <option value="">{(!selectedDoctor || !form.weekday) ? 'Select doctor and weekday' : (slotsForWeekday.length ? 'Select a slot' : 'No slots for selected day')}</option>
                {slotsForWeekday.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            {/* Summary */}
            <div className="md:col-span-3">
              <div className="mt-2 p-3 sm:p-4 rounded-xl border bg-gray-50 text-sm text-gray-700 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
                <div><span className="text-gray-500">Doctor:</span> <span className="font-medium">{selectedDoctor ? (selectedDoctor.user?.name || '—') : '—'}</span></div>
                <div><span className="text-gray-500">Date:</span> <span className="font-medium">{form.date || '—'}</span></div>
                <div><span className="text-gray-500">Weekday:</span> <span className="font-medium">{selectedWeekday || '—'}</span></div>
                <div><span className="text-gray-500">Time:</span> <span className="font-medium">{form.time || '—'}</span></div>
              </div>
            </div>
            <div className="md:col-span-3 flex justify-end">
              <button className="btn-primary w-full sm:w-auto disabled:opacity-60" disabled={submitting || !form.doctorId || !form.date || !form.weekday || !form.time || (user && user.role !== 'patient') || (form.date && form.weekday && weekdayShort(form.date) !== form.weekday)}>{submitting ? 'Booking...' : 'Confirm Booking'}</button>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}
