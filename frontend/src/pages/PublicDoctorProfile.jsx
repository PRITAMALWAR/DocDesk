import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../api/client'

export default function PublicDoctorProfile(){
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [doc, setDoc] = useState(null)

  useEffect(()=>{
    const load = async ()=>{
      setLoading(true); setError('')
      try{
        const data = await api(`/api/doctors/${id}`)
        setDoc(data)
      }catch(e){ setError('Doctor not found') }
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return <div className="container py-10">Loading...</div>
  if (error) return <div className="container py-10 text-red-600">{error}</div>
  if (!doc) return <div className="container py-10">Doctor not found</div>

  return (
    <div className="container py-8">
      <div className="bg-white border rounded-2xl shadow-sm p-6 grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 text-center">
          <img src={doc.profilePhoto || 'https://via.placeholder.com/160'} alt="doctor" className="w-32 h-32 rounded-full object-cover border mx-auto"/>
          <div className="mt-3 text-lg font-semibold">{doc?.user?.name}</div>
          <div className="text-sm text-gray-600">{doc.specialty}</div>
          <div className="text-xs text-gray-500 mt-1">Rating: {typeof doc.rating==='number' ? `${Math.round(doc.rating*10)/10}/5` : '-'} ({doc.ratingCount||0})</div>
        </div>
        <div className="md:col-span-2 grid gap-3">
          {doc.degree && <div><span className="text-sm text-gray-600">Degree:</span> <span className="font-medium">{doc.degree}</span></div>}
          {doc.gender && <div><span className="text-sm text-gray-600">Gender:</span> <span className="font-medium">{doc.gender}</span></div>}
          {Array.isArray(doc.languages) && doc.languages.length>0 && <div><span className="text-sm text-gray-600">Languages:</span> <span className="font-medium">{doc.languages.join(', ')}</span></div>}
          {typeof doc.experienceYears==='number' && <div><span className="text-sm text-gray-600">Experience:</span> <span className="font-medium">{doc.experienceYears} years</span></div>}
          {doc.hospitalName && <div><span className="text-sm text-gray-600">Hospital:</span> <span className="font-medium">{doc.hospitalName}</span></div>}
          {doc.clinicAddress && <div><span className="text-sm text-gray-600">Clinic:</span> <span className="font-medium">{doc.clinicAddress}</span></div>}

          <div className="mt-2">
            <div className="text-sm text-gray-700">Availability</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {(doc.availability||[]).map(a => (
                <span key={a.day} className="px-3 py-1 rounded-full border text-sm">{a.day}: {(a.slots||[]).slice(0,3).join(', ')}{(a.slots||[]).length>3?'...':''}</span>
              ))}
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <Link to="/book" className="btn-primary">Book Appointment</Link>
            <Link to="/doctors" className="px-4 py-2 border rounded-lg text-sm">Back to List</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
