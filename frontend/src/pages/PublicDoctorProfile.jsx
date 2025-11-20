import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../api/client'
import StarRating from '../components/StarRating'

export default function PublicDoctorProfile(){
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [doc, setDoc] = useState(null)
  const [feedback, setFeedback] = useState([])
  const [showAllFeedback, setShowAllFeedback] = useState(false)

  useEffect(()=>{
    const load = async ()=>{
      setLoading(true); setError('')
      try{
        const [data, feedbackData] = await Promise.all([
          api(`/api/doctors/${id}`),
          api(`/api/feedback/doctor/${id}`).catch(() => [])
        ])
        setDoc(data)
        setFeedback(Array.isArray(feedbackData) ? feedbackData : [])
      }catch(e){ setError('Doctor not found') }
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return <div className="container py-10">Loading...</div>
  if (error) return <div className="container py-10 text-red-600">{error}</div>
  if (!doc) return <div className="container py-10">Doctor not found</div>

  return (
    <div className="container py-6 sm:py-8 px-4 sm:px-6">
      <div className="bg-white border rounded-2xl shadow-sm p-4 sm:p-6 grid md:grid-cols-3 gap-4 sm:gap-6">
        <div className="md:col-span-1 text-center">
          <img src={doc.profilePhoto || 'https://via.placeholder.com/160'} alt="doctor" className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border mx-auto"/>
          <div className="mt-3 text-base sm:text-lg font-semibold">{doc?.user?.name}</div>
          <div className="text-sm text-gray-600">{doc.specialty}</div>
          <div className="mt-3 flex flex-col items-center gap-2">
            <StarRating rating={doc.rating || 0} readonly size="md" />
            <div className="text-xs sm:text-sm text-gray-600">
              {typeof doc.rating==='number' ? `${Math.round(doc.rating*10)/10}` : '0'}/5 
              <span className="text-gray-500"> ({doc.ratingCount||0} {doc.ratingCount === 1 ? 'review' : 'reviews'})</span>
            </div>
          </div>
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
                <span key={a.day} className="px-2 sm:px-3 py-1 rounded-full border text-xs sm:text-sm">{a.day}: {(a.slots||[]).slice(0,3).join(', ')}{(a.slots||[]).length>3?'...':''}</span>
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <Link to="/book" className="btn-primary text-center">Book Appointment</Link>
            <Link to="/doctors" className="px-4 py-2 border rounded-lg text-sm text-center">Back to List</Link>
          </div>
        </div>
      </div>

      {/* Feedback Section */}
      {feedback.length > 0 && (
        <div className="mt-6 bg-white border rounded-2xl shadow-sm p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Patient Reviews</h2>
            {feedback.length > 3 && (
              <button
                onClick={() => setShowAllFeedback(!showAllFeedback)}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                {showAllFeedback ? 'Show Less' : `Show All (${feedback.length})`}
              </button>
            )}
          </div>
          <div className="space-y-4">
            {(showAllFeedback ? feedback : feedback.slice(0, 3)).map((f) => (
              <div key={f._id} className="border-b pb-4 last:border-b-0 last:pb-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-medium text-gray-900">
                      {f?.patient?.name || 'Anonymous Patient'}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(f.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                  <StarRating rating={f.rating} readonly size="sm" />
                </div>
                {f.comments && (
                  <div className="mt-2 text-gray-700 text-sm">{f.comments}</div>
                )}
              </div>
            ))}
          </div>
          {feedback.length === 0 && (
            <div className="text-center text-gray-500 py-4">No reviews yet</div>
          )}
        </div>
      )}
    </div>
  )
}
