import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'
import Toast from '../components/Toast'

export default function Signup(){
  const { setUser } = useAuth()
  const nav = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'patient' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)
  const [success, setSuccess] = useState('')
  const [fieldErr, setFieldErr] = useState({ name: '', email: '', password: '' })

  // Doctor extra fields
  const [doc, setDoc] = useState({
    profilePhoto: 'https://img.freepik.com/premium-vector/icon-doctor-emergency-doctor-medical-healthcare-concept-vector-illustration-flat-design-style-avatar-medical-worker_153097-1307.jpg',
    specialty: 'Cardiologist',
    degree: 'MBBS',
    gender: 'Male',
    languages: ['English'],
    availableDays: ['Mon','Wed','Fri'],
    timeSlots: ['10:00','10:30'],
    experienceYears: 0,
    hospitalName: '',
    clinicAddress: ''
  })
  const [gen12, setGen12] = useState({ start: '', startAmpm: 'AM', end: '', endAmpm: 'PM', interval: 30 })

  const submit = async (e)=>{
    e.preventDefault()
    setError('')
    setFieldErr({ name: '', email: '', password: '' })
    let hasErr = false
    if(!form.name){ setFieldErr(f=>({...f, name: 'Name is required'})); hasErr = true }
    if(!form.email){ setFieldErr(f=>({...f, email: 'Email is required'})); hasErr = true }
    else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)){ setFieldErr(f=>({...f, email: 'Enter a valid email'})); hasErr = true }
    if(!form.password){ setFieldErr(f=>({...f, password: 'Password is required'})); hasErr = true }
    else if(form.password.length < 6){ setFieldErr(f=>({...f, password: 'Minimum 6 characters'})); hasErr = true }
    if (hasErr) return
    setLoading(true)
    try{
      const res = await api('/api/auth/register', { method: 'POST', body: form })
      // If doctor, create their profile immediately
      if (form.role === 'doctor' && res?.token) {
        try {
          await api('/api/doctors/me', {
            method: 'POST',
            token: res.token,
            body: {
              specialty: doc.specialty,
              profilePhoto: doc.profilePhoto,
              degree: doc.degree,
              gender: doc.gender,
              languages: doc.languages,
              hospitalName: doc.hospitalName,
              clinicAddress: doc.clinicAddress,
              experienceYears: Number(doc.experienceYears) || 0,
              availableDays: doc.availableDays,
              timeSlots: doc.timeSlots,
            }
          })
        } catch (e) {
          // Non-blocking: still log the user in even if profile creation fails
        }
      }
      setUser(res)
      setSuccess('Account created successfully')
      setTimeout(()=> nav('/'), 800)
    }catch(e){
      let msg = 'Sign up failed'
      try {
        const parsed = JSON.parse(e.message)
        if (parsed?.message) msg = parsed.message
      } catch {
        if (e?.message) msg = e.message
      }
      setError(msg)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-start justify-center bg-gradient-to-b from-white to-gray-50 p-6">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Create your account</h2>
          <p className="text-gray-600 mt-1">Join DocDesk in seconds</p>
        </div>
        {error && <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">{error}</div>}
        <form onSubmit={submit} className="mt-6 grid gap-4">
          <div>
            <label className="block text-sm text-gray-700">Name</label>
            <input value={form.name} onChange={(e)=>setForm(f=>({...f, name: e.target.value}))} placeholder="Your name" className={`mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 ${fieldErr.name ? 'border-red-400' : ''}`}/>
            {fieldErr.name && <p className="text-xs text-red-600 mt-1">{fieldErr.name}</p>}
          </div>
          <div>
            <label className="block text-sm text-gray-700">Email</label>
            <input type="email" value={form.email} onChange={(e)=>setForm(f=>({...f, email: e.target.value}))} placeholder="you@example.com" className={`mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 ${fieldErr.email ? 'border-red-400' : ''}`}/>
            {fieldErr.email && <p className="text-xs text-red-600 mt-1">{fieldErr.email}</p>}
          </div>
          <div>
            <label className="block text-sm text-gray-700">Password</label>
            <div className="relative">
              <input type={showPwd ? 'text' : 'password'} value={form.password} onChange={(e)=>setForm(f=>({...f, password: e.target.value}))} placeholder="••••••••" className={`mt-1 w-full border rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-primary-500 ${fieldErr.password ? 'border-red-400' : ''}`}/>
              <button type="button" onClick={()=>setShowPwd(s=>!s)} className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700">{showPwd ? 'Hide' : 'Show'}</button>
            </div>
            {fieldErr.password && <p className="text-xs text-red-600 mt-1">{fieldErr.password}</p>}
          </div>
          <div>
            <label className="block text-sm text-gray-700">Role</label>
            <select value={form.role} onChange={(e)=>setForm(f=>({...f, role: e.target.value}))} className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>

          {form.role === 'doctor' && (
            <div className="mt-4 grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-700">Profile Photo URL</label>
                <input value={doc.profilePhoto} onChange={(e)=>setDoc(d=>({...d, profilePhoto: e.target.value}))} placeholder="https://..." className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"/>
              </div>
              <div>
                <label className="block text-sm text-gray-700">Specialization</label>
                <select value={doc.specialty} onChange={(e)=>setDoc(d=>({...d, specialty: e.target.value}))} className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                  {['Cardiologist','Dermatologist','Dentist','Neurologist'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700">Degree / Qualification</label>
                <select value={doc.degree} onChange={(e)=>setDoc(d=>({...d, degree: e.target.value}))} className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                  {['MBBS','MD','MS','BDS'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700">Gender</label>
                <select value={doc.gender} onChange={(e)=>setDoc(d=>({...d, gender: e.target.value}))} className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500">
                  {['Male','Female','Other'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-700">Languages Spoken</label>
                <div className="mt-2 flex gap-4 text-sm text-gray-700">
                  {['English','Hindi'].map(l => (
                    <label key={l} className="inline-flex items-center gap-2">
                      <input type="checkbox" checked={doc.languages.includes(l)} onChange={(e)=>setDoc(d=> ({...d, languages: e.target.checked ? Array.from(new Set([...d.languages,l])) : d.languages.filter(x=>x!==l)}))} /> {l}
                    </label>
                  ))}
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-700">Available Days</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(dy => {
                    const active = doc.availableDays.includes(dy)
                    return (
                      <button
                        type="button"
                        key={dy}
                        onClick={()=> setDoc(d=> ({...d, availableDays: active ? d.availableDays.filter(x=>x!==dy) : [...d.availableDays, dy]}))}
                        className={`px-3 py-1 rounded-full border text-sm ${active ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'}`}
                      >{dy}</button>
                    )
                  })}
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-700">Available Time Range</label>
                <div className="mt-2 grid md:grid-cols-5 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs text-gray-600">From</label>
                    <div className="mt-1 flex gap-2">
                      <input
                        type="text"
                        placeholder="hh:mm"
                        value={gen12.start}
                        onChange={(e)=>setGen12(g=>({...g, start: e.target.value}))}
                        className="w-full border rounded-lg px-3 py-2"
                      />
                      <select value={gen12.startAmpm} onChange={(e)=>setGen12(g=>({...g, startAmpm: e.target.value}))} className="border rounded-lg px-2">
                        <option>AM</option>
                        <option>PM</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs text-gray-600">To</label>
                    <div className="mt-1 flex gap-2">
                      <input
                        type="text"
                        placeholder="hh:mm"
                        value={gen12.end}
                        onChange={(e)=>setGen12(g=>({...g, end: e.target.value}))}
                        className="w-full border rounded-lg px-3 py-2"
                      />
                      <select value={gen12.endAmpm} onChange={(e)=>setGen12(g=>({...g, endAmpm: e.target.value}))} className="border rounded-lg px-2">
                        <option>AM</option>
                        <option>PM</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600">Interval</label>
                    <select value={gen12.interval} onChange={(e)=>setGen12(g=>({...g, interval: Number(e.target.value)}))} className="mt-1 w-full border rounded-lg px-3 py-2">
                      {[15,30,45,60].map(m => <option key={m} value={m}>{m}m</option>)}
                    </select>
                  </div>
                </div>
                <div className="mt-3">
                  <button type="button" className="btn-primary" onClick={()=>{
                    const toMinutes = (hhmm, ampm) => {
                      const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm || '')
                      if (!m) return null
                      let h = parseInt(m[1],10)
                      const min = parseInt(m[2],10)
                      if (h<1 || h>12 || min<0 || min>59) return null
                      h = h % 12 + (ampm === 'PM' ? 12 : 0)
                      return h*60 + min
                    }
                    const s = toMinutes(gen12.start, gen12.startAmpm)
                    const e = toMinutes(gen12.end, gen12.endAmpm)
                    const step = Number(gen12.interval) || 30
                    if (s==null || e==null || e < s) return
                    const slots = []
                    let cur = s
                    while (cur <= e) {
                      const hh = String(Math.floor(cur/60)).padStart(2,'0')
                      const mm = String(cur%60).padStart(2,'0')
                      slots.push(`${hh}:${mm}`)
                      cur += step
                    }
                    setDoc(d=> ({...d, timeSlots: Array.from(new Set([...(d.timeSlots||[]), ...slots]))}))
                  }}>Generate</button>
                </div>
                {doc.timeSlots.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {doc.timeSlots.map(t => (
                      <span key={t} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm">
                        {t}
                        <button type="button" onClick={()=> setDoc(d=> ({...d, timeSlots: d.timeSlots.filter(x=>x!==t)}))} className="text-gray-500 hover:text-gray-700">×</button>
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-2">Enter hh:mm and choose AM/PM. Click Generate to create 24h slots.</p>
              </div>
              <div>
                <label className="block text-sm text-gray-700">Hospital Name</label>
                <input value={doc.hospitalName} onChange={(e)=>setDoc(d=>({...d, hospitalName: e.target.value}))} className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"/>
              </div>
              <div>
                <label className="block text-sm text-gray-700">Clinic Address</label>
                <input value={doc.clinicAddress} onChange={(e)=>setDoc(d=>({...d, clinicAddress: e.target.value}))} className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"/>
              </div>
              <div>
                <label className="block text-sm text-gray-700">Experience (years)</label>
                <input type="number" min="0" value={doc.experienceYears} onChange={(e)=>setDoc(d=>({...d, experienceYears: e.target.value}))} className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"/>
              </div>
            </div>
          )}

          <button disabled={loading} className="btn-primary w-full mt-2 disabled:opacity-70">{loading? 'Creating...' : 'Sign up'}</button>
        </form>
        <div className="text-sm text-gray-700 mt-5 text-center">Have an account? <Link to="/login" className="text-primary-600 font-semibold">Login</Link></div>
      </div>
      <Toast kind="success" message={success} onClose={()=>setSuccess('')} />
    </div>
  )
}
