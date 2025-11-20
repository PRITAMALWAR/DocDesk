import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate()
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const [docMap, setDocMap] = useState({})
  const [feedbackMap, setFeedbackMap] = useState({})

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
        
        // Load feedback status for confirmed and completed appointments
        if (user?.token) {
          const eligibleApps = apps.filter(a => 
            (a.status === 'confirmed' || a.status === 'completed') && a.doctor
          )
          const feedbackChecks = await Promise.all(
            eligibleApps.map(app => {
              const doctorId = typeof app.doctor === 'object' ? app.doctor._id : app.doctor
              if (!doctorId) return { doctorId: null, hasFeedback: false, canSubmit: false }
              
              return api(`/api/feedback/check/${doctorId}`, { token: user.token })
                .then(data => ({ 
                  doctorId, 
                  hasFeedback: data?.exists || false,
                  canSubmit: data?.canSubmit !== false
                }))
                .catch((err) => {
                  // Silently handle errors (404, 401, 403, etc.) - user just can't submit feedback
                  console.debug(`Feedback check failed for doctor ${doctorId}:`, err.message)
                  return { doctorId, hasFeedback: false, canSubmit: false }
                })
            })
          )
          const feedbackStatus = {}
          feedbackChecks.forEach(({ doctorId, hasFeedback, canSubmit }) => {
            feedbackStatus[doctorId] = { hasFeedback, canSubmit }
          })
          setFeedbackMap(feedbackStatus)
        }
      }catch(e){ setErr('Failed to load appointments') }
      setLoading(false)
    }
    load()
  },[user?.token])

  return (
    <div className="container py-6 sm:py-10 px-4 sm:px-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-4">My Appointments</h2>
      {err && <div className="text-sm text-red-600 mb-4">{err}</div>}
      {loading ? <div className="text-center py-8">Loading...</div> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-600">No appointments found</div>
          ) : (
            list.map(ap => (
              <div key={ap._id} className="card">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="font-semibold text-sm sm:text-base">{(ap.date || '').slice(0,10)} · {ap.time}</div>
                  <Badge status={ap.status} />
                </div>
                <div className="text-sm text-gray-700 mt-2 space-y-1">
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
                {(ap.status === 'confirmed' || ap.status === 'completed') && ap.doctor && (
                  <div className="mt-3 pt-3 border-t">
                    {(() => {
                      const doctorId = typeof ap.doctor === 'object' ? ap.doctor._id : ap.doctor
                      const feedbackInfo = feedbackMap[doctorId] || { hasFeedback: false, canSubmit: true }
                      const hasFeedback = feedbackInfo.hasFeedback
                      const canSubmit = feedbackInfo.canSubmit !== false
                      
                      if (!canSubmit) return null
                      
                      return (
                        <button
                          onClick={() => navigate(`/feedback/${doctorId}`)}
                          className={`text-sm w-full sm:w-auto px-3 py-1.5 rounded-lg ${
                            hasFeedback
                              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              : 'bg-primary-600 text-white hover:bg-primary-700'
                          }`}
                        >
                          {hasFeedback ? 'Update Feedback' : 'Rate Doctor'}
                        </button>
                      )
                    })()}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
