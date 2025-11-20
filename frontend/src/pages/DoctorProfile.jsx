import React, { useEffect, useState } from 'react'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'

const dayOrder = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

export default function DoctorProfile(){
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [profile, setProfile] = useState(null)
  const [edit, setEdit] = useState(false)
  const [noProfile, setNoProfile] = useState(false)
  const [form, setForm] = useState({
    profilePhoto: '',
    specialty: '',
    degree: '',
    gender: 'Male',
    languages: [],
    hospitalName: '',
    clinicAddress: '',
    experienceYears: 0,
    availableDays: [],
    timeSlots: []
  })
  const [gen, setGen] = useState({ start: '', end: '', interval: 30 })
  const [timeInput, setTimeInput] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await api('/api/doctors/me', { token: user?.token })
      setProfile(data)
      setNoProfile(false)
      // flatten availability to days + slots
      const days = Array.isArray(data?.availability) ? data.availability.map(a=>a.day) : []
      const slots = Array.isArray(data?.availability) && data.availability[0] ? (data.availability[0].slots || []) : []
      setForm({
        profilePhoto: data.profilePhoto || '',
        specialty: data.specialty || '',
        degree: data.degree || '',
        gender: data.gender || 'Male',
        languages: data.languages || [],
        hospitalName: data.hospitalName || '',
        clinicAddress: data.clinicAddress || '',
        experienceYears: typeof data.experienceYears === 'number' ? data.experienceYears : 0,
        availableDays: days,
        timeSlots: slots,
      })
    } catch (e) {
      // If backend responded 404 with message, enter create mode
      try {
        const parsed = JSON.parse(e.message)
        if (parsed?.message && /not found/i.test(parsed.message)) {
          setProfile(null)
          setNoProfile(true)
          setEdit(true)
          setError('')
        } else if (parsed?.message) {
          setError(parsed.message)
        } else {
          setError('Failed to load profile')
        }
      } catch {
        if (/not found/i.test(e.message || '')) {
          setProfile(null)
          setNoProfile(true)
          setEdit(true)
          setError('')
        } else {
          setError(e.message || 'Failed to load profile')
        }
      }
    }
    setLoading(false)
  }

  useEffect(()=>{ load() // eslint-disable-next-line
  },[])

  const save = async () => {
    setError('')
    if (!form.specialty) { setError('Please select your specialization'); return }
    try {
      await api('/api/doctors/me', { method: 'PUT', token: user?.token, body: {
        specialty: form.specialty,
        profilePhoto: form.profilePhoto,
        degree: form.degree,
        gender: form.gender,
        languages: form.languages,
        hospitalName: form.hospitalName,
        clinicAddress: form.clinicAddress,
        experienceYears: Number(form.experienceYears) || 0,
        availableDays: form.availableDays,
        timeSlots: form.timeSlots,
      }})
      setEdit(false)
      await load()
    } catch (e) {
      let msg = 'Failed to save profile'
      try { const j = JSON.parse(e.message); if (j?.message) msg = j.message } catch {}
      setError(msg)
    }
  }

  const createProfile = async () => {
    setError('')
    if (!form.specialty) { setError('Please select your specialization'); return }
    try {
      await api('/api/doctors/me', { method: 'POST', token: user?.token, body: {
        specialty: form.specialty,
        profilePhoto: form.profilePhoto,
        degree: form.degree,
        gender: form.gender,
        languages: form.languages,
        hospitalName: form.hospitalName,
        clinicAddress: form.clinicAddress,
        experienceYears: Number(form.experienceYears) || 0,
        availableDays: form.availableDays,
        timeSlots: form.timeSlots,
      }})
      setNoProfile(false)
      setEdit(false)
      await load()
    } catch (e) {
      let msg = 'Failed to create profile'
      try { const j = JSON.parse(e.message); if (j?.message) msg = j.message } catch {}
      setError(msg)
    }
  }

  if (loading) return <div className="container py-6 sm:py-10 px-4 sm:px-6">Loading...</div>
  if (error) return <div className="container py-6 sm:py-10 px-4 sm:px-6 text-red-600">{error}</div>

  if (noProfile) {
    return (
      <div className="container py-6 sm:py-8 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Create Doctor Profile</h1>
          <button className="btn-primary w-full sm:w-auto" onClick={createProfile}>Create Profile</button>
        </div>
        <div className="bg-white border rounded-2xl shadow-sm p-4 sm:p-6 grid md:grid-cols-3 gap-4 sm:gap-6">
          <div className="md:col-span-1 flex flex-col items-center">
            <img src={(form.profilePhoto || 'https://via.placeholder.com/160')} alt="profile" className="w-32 h-32 rounded-full object-cover border"/>
            <input className="mt-3 w-full border rounded-lg px-3 py-2" placeholder="Profile photo URL" value={form.profilePhoto} onChange={(e)=>setForm(f=>({...f, profilePhoto: e.target.value}))} />
          </div>
          <div className="md:col-span-2 grid gap-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700">Specialization</label>
                <select value={form.specialty} onChange={(e)=>setForm(f=>({...f, specialty: e.target.value}))} className="mt-1 w-full border rounded-lg px-3 py-2">
                  <option value="">Select</option>
                  {['Cardiologist','Dermatologist','Dentist','Neurologist'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700">Degree</label>
                <select value={form.degree} onChange={(e)=>setForm(f=>({...f, degree: e.target.value}))} className="mt-1 w-full border rounded-lg px-3 py-2">
                  {['MBBS','MD','MS','BDS'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700">Gender</label>
                <select value={form.gender} onChange={(e)=>setForm(f=>({...f, gender: e.target.value}))} className="mt-1 w-full border rounded-lg px-3 py-2">
                  {['Male','Female','Other'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700">Languages</label>
                <div className="mt-1 flex gap-4 text-sm text-gray-700">
                  {['English','Hindi'].map(l => (
                    <label key={l} className="inline-flex items-center gap-2">
                      <input type="checkbox" checked={form.languages.includes(l)} onChange={(e)=>setForm(f=> ({...f, languages: e.target.checked ? Array.from(new Set([...f.languages,l])) : f.languages.filter(x=>x!==l)}))} /> {l}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700">Hospital Name</label>
                <input value={form.hospitalName} onChange={(e)=>setForm(f=>({...f, hospitalName: e.target.value}))} className="mt-1 w-full border rounded-lg px-3 py-2"/>
              </div>
              <div>
                <label className="block text-sm text-gray-700">Clinic Address</label>
                <input value={form.clinicAddress} onChange={(e)=>setForm(f=>({...f, clinicAddress: e.target.value}))} className="mt-1 w-full border rounded-lg px-3 py-2"/>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-700">Availability</label>
              <div className="mt-2">
                <div className="flex flex-wrap gap-2 mb-3">
                  {dayOrder.map(dy => {
                    const active = form.availableDays.includes(dy)
                    return (
                      <button type="button" key={dy} onClick={()=> setForm(f=> ({...f, availableDays: active ? f.availableDays.filter(x=>x!==dy) : [...f.availableDays, dy]}))} className={`px-3 py-1 rounded-full border text-sm ${active ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'}`}>{dy}</button>
                    )
                  })}
                </div>
                <div className="mt-2 grid md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600">From</label>
                    <input type="time" value={gen.start} onChange={(e)=>setGen(g=>({...g, start: e.target.value}))} className="mt-1 w-full border rounded-lg px-3 py-2"/>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600">Till</label>
                    <input type="time" value={gen.end} onChange={(e)=>setGen(g=>({...g, end: e.target.value}))} className="mt-1 w-full border rounded-lg px-3 py-2"/>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600">Interval (min)</label>
                    <select value={gen.interval} onChange={(e)=>setGen(g=>({...g, interval: Number(e.target.value)}))} className="mt-1 w-full border rounded-lg px-3 py-2">
                      {[15,30,45,60].map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button type="button" className="btn-primary w-full" onClick={()=>{
                      const { start, end, interval } = gen
                      if (!start || !end || !interval) return
                      const [sh, sm] = start.split(':').map(Number)
                      const [eh, em] = end.split(':').map(Number)
                      let cur = sh*60 + sm
                      const endMin = eh*60 + em
                      const slots = []
                      while (cur <= endMin) {
                        const hh = String(Math.floor(cur/60)).padStart(2,'0')
                        const mm = String(cur%60).padStart(2,'0')
                        slots.push(`${hh}:${mm}`)
                        cur += interval
                      }
                      setForm(f=> ({...f, timeSlots: Array.from(new Set([...(f.timeSlots||[]), ...slots]))}))
                    }}>Generate</button>
                  </div>
                </div>
                {form.timeSlots.length>0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {form.timeSlots.map(t => (
                      <span key={t} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm">
                        {t}
                        <button type="button" onClick={()=> setForm(f=> ({...f, timeSlots: f.timeSlots.filter(x=>x!==t)}))} className="text-gray-500 hover:text-gray-700">×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-6 sm:py-8 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">My Doctor Profile</h1>
        {!edit ? (
          <button className="btn-primary w-full sm:w-auto" onClick={()=>setEdit(true)}>Edit Profile</button>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button className="btn-primary w-full sm:w-auto" onClick={save}>Save</button>
            <button className="px-4 py-2 rounded-lg border w-full sm:w-auto" onClick={()=>{ setEdit(false); load() }}>Cancel</button>
          </div>
        )}
      </div>

      <div className="bg-white border rounded-2xl shadow-sm p-4 sm:p-6 grid md:grid-cols-3 gap-4 sm:gap-6">
        <div className="md:col-span-1 flex flex-col items-center">
          <img src={edit ? (form.profilePhoto || 'https://via.placeholder.com/160') : (profile.profilePhoto || 'https://via.placeholder.com/160')} alt="profile" className="w-32 h-32 rounded-full object-cover border"/>
          {edit && (
            <input className="mt-3 w-full border rounded-lg px-3 py-2" placeholder="Profile photo URL" value={form.profilePhoto} onChange={(e)=>setForm(f=>({...f, profilePhoto: e.target.value}))} />
          )}
          <div className="mt-4 text-center">
            <div className="text-lg font-medium">{profile?.user?.name}</div>
            <div className="text-sm text-gray-500">{profile?.user?.email}</div>
          </div>
        </div>

        <div className="md:col-span-2 grid gap-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700">Specialization</label>
              {!edit ? (
                <div className="mt-1 text-gray-900">{profile.specialty || '-'}</div>
              ) : (
                <select value={form.specialty} onChange={(e)=>setForm(f=>({...f, specialty: e.target.value}))} className="mt-1 w-full border rounded-lg px-3 py-2">
                  {['Cardiologist','Dermatologist','Dentist','Neurologist'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-700">Degree</label>
              {!edit ? (
                <div className="mt-1 text-gray-900">{profile.degree || '-'}</div>
              ) : (
                <select value={form.degree} onChange={(e)=>setForm(f=>({...f, degree: e.target.value}))} className="mt-1 w-full border rounded-lg px-3 py-2">
                  {['MBBS','MD','MS','BDS'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700">Gender</label>
              {!edit ? (
                <div className="mt-1 text-gray-900">{profile.gender || '-'}</div>
              ) : (
                <select value={form.gender} onChange={(e)=>setForm(f=>({...f, gender: e.target.value}))} className="mt-1 w-full border rounded-lg px-3 py-2">
                  {['Male','Female','Other'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-700">Languages</label>
              {!edit ? (
                <div className="mt-1 text-gray-900">{(profile.languages||[]).join(', ') || '-'}</div>
              ) : (
                <div className="mt-1 flex gap-4 text-sm text-gray-700">
                  {['English','Hindi'].map(l => (
                    <label key={l} className="inline-flex items-center gap-2">
                      <input type="checkbox" checked={form.languages.includes(l)} onChange={(e)=>setForm(f=> ({...f, languages: e.target.checked ? Array.from(new Set([...f.languages,l])) : f.languages.filter(x=>x!==l)}))} /> {l}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700">Hospital Name</label>
              {!edit ? (
                <div className="mt-1 text-gray-900">{profile.hospitalName || '-'}</div>
              ) : (
                <input value={form.hospitalName} onChange={(e)=>setForm(f=>({...f, hospitalName: e.target.value}))} className="mt-1 w-full border rounded-lg px-3 py-2"/>
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-700">Clinic Address</label>
              {!edit ? (
                <div className="mt-1 text-gray-900">{profile.clinicAddress || '-'}</div>
              ) : (
                <input value={form.clinicAddress} onChange={(e)=>setForm(f=>({...f, clinicAddress: e.target.value}))} className="mt-1 w-full border rounded-lg px-3 py-2"/>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700">Experience (years)</label>
              {!edit ? (
                <div className="mt-1 text-gray-900">{typeof profile.experienceYears==='number' ? profile.experienceYears : '-'}</div>
              ) : (
                <input type="number" min="0" value={form.experienceYears} onChange={(e)=>setForm(f=>({...f, experienceYears: e.target.value}))} className="mt-1 w-full border rounded-lg px-3 py-2"/>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700">Availability</label>
            {!edit ? (
              <div className="mt-2">
                <div className="flex flex-wrap gap-2 mb-3">
                  {dayOrder.map(dy => (
                    <span key={dy} className={`px-3 py-1 rounded-full text-sm border ${profile.availability?.some(a=>a.day===dy) ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-600 border-gray-300'}`}>{dy}</span>
                  ))}
                </div>
                <div className="space-y-2">
                  {(profile.availability || []).map(a => (
                    <div key={a.day} className="flex items-center gap-3 flex-wrap">
                      <span className="text-xs font-medium text-gray-600 w-12">{a.day}</span>
                      <div className="flex flex-wrap gap-2">
                        {(a.slots||[]).map(t => (
                          <span key={`${a.day}-${t}`} className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm">{t}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                  {(!profile.availability || profile.availability.length===0) && (
                    <div className="text-sm text-gray-500">No availability added yet.</div>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-2">
                <div className="flex flex-wrap gap-2 mb-3">
                  {dayOrder.map(dy => {
                    const active = form.availableDays.includes(dy)
                    return (
                      <button type="button" key={dy} onClick={()=> setForm(f=> ({...f, availableDays: active ? f.availableDays.filter(x=>x!==dy) : [...f.availableDays, dy]}))} className={`px-3 py-1 rounded-full border text-sm ${active ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'}`}>{dy}</button>
                    )
                  })}
                </div>
                <div className="flex items-center gap-3">
                  <input type="time" value={timeInput} onChange={(e)=>setTimeInput(e.target.value)} className="border rounded-lg px-3 py-2"/>
                  <button type="button" className="btn-primary px-4 py-2" onClick={()=>{ if(!timeInput) return; setForm(f=>({...f, timeSlots: f.timeSlots.includes(timeInput) ? f.timeSlots : [...f.timeSlots, timeInput]})); setTimeInput('') }}>Add</button>
                </div>
                {form.timeSlots.length>0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {form.timeSlots.map(t => (
                      <span key={t} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm">
                        {t}
                        <button type="button" onClick={()=> setForm(f=> ({...f, timeSlots: f.timeSlots.filter(x=>x!==t)}))} className="text-gray-500 hover:text-gray-700">×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
