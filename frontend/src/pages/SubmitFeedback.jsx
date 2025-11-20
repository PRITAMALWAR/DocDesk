import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'
import StarRating from '../components/StarRating'
import Toast from '../components/Toast'

export default function SubmitFeedback() {
  const { doctorId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [doctor, setDoctor] = useState(null)
  const [existingFeedback, setExistingFeedback] = useState(null)
  const [form, setForm] = useState({
    rating: 0,
    comments: ''
  })

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const [docData, feedbackData] = await Promise.all([
          api(`/api/doctors/${doctorId}`),
          api(`/api/feedback/check/${doctorId}`, { token: user?.token })
        ])
        setDoctor(docData)
        if (feedbackData.exists && feedbackData.feedback) {
          setExistingFeedback(feedbackData.feedback)
          setForm({
            rating: feedbackData.feedback.rating || 0,
            comments: feedbackData.feedback.comments || ''
          })
        }
      } catch (e) {
        const msg = e.message || 'Failed to load doctor information'
        try {
          const parsed = JSON.parse(msg)
          setError(parsed.message || msg)
        } catch {
          setError(msg)
        }
      }
      setLoading(false)
    }
    if (doctorId && user?.token) {
      load()
    }
  }, [doctorId, user?.token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.rating === 0) {
      setError('Please select a rating')
      return
    }
    
    setSubmitting(true)
    setError('')
    setSuccess('')
    
    try {
      await api('/api/feedback', {
        method: 'POST',
        token: user?.token,
        body: {
          doctorId,
          rating: form.rating,
          comments: form.comments.trim()
        }
      })
      setSuccess('Feedback submitted successfully!')
      setTimeout(() => {
        navigate('/appointments')
      }, 1500)
    } catch (e) {
      const msg = e.message || 'Failed to submit feedback'
      try {
        const parsed = JSON.parse(msg)
        setError(parsed.message || msg)
      } catch {
        setError(msg)
      }
    }
    setSubmitting(false)
  }

  if (loading) {
    return (
      <div className="container py-10">
        <div className="bg-white border rounded-2xl p-8 text-center">Loading...</div>
      </div>
    )
  }

  if (error && !doctor) {
    return (
      <div className="container py-10">
        <div className="bg-white border rounded-2xl p-8">
          <div className="text-red-600 mb-4">{error}</div>
          <button onClick={() => navigate('/doctors')} className="btn-primary">
            Back to Doctors
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-6 sm:py-8 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-4 sm:mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            ← Back
          </button>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            {existingFeedback ? 'Update Your Feedback' : 'Submit Feedback'}
          </h1>
          {doctor && (
            <div className="mt-2 text-sm text-gray-600">
              For Dr. {doctor?.user?.name || 'Doctor'} - {doctor?.specialty || ''}
            </div>
          )}
        </div>

        {success && <Toast kind="success" message={success} onClose={() => setSuccess('')} />}
        {error && <Toast kind="error" message={error} onClose={() => setError('')} />}

        <form onSubmit={handleSubmit} className="bg-white border rounded-2xl shadow-sm p-4 sm:p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Rating <span className="text-red-500">*</span>
            </label>
            <StarRating
              rating={form.rating}
              onRatingChange={(rating) => setForm({ ...form, rating })}
              size="lg"
            />
            {form.rating > 0 && (
              <div className="mt-2 text-sm text-gray-600">
                {form.rating} out of 5 stars
              </div>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comments (Optional)
            </label>
            <textarea
              value={form.comments}
              onChange={(e) => setForm({ ...form, comments: e.target.value })}
              rows={6}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Share your experience with this doctor..."
            />
            <div className="mt-1 text-xs text-gray-500">
              {form.comments.length} characters
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={submitting || form.rating === 0}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
            >
              {submitting ? 'Submitting...' : existingFeedback ? 'Update Feedback' : 'Submit Feedback'}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50 w-full sm:w-auto"
            >
              Cancel
            </button>
          </div>
        </form>

        {existingFeedback && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
            <strong>Note:</strong> You have already submitted feedback for this doctor. 
            Submitting again will update your existing feedback.
          </div>
        )}
        
        {!existingFeedback && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-800">
            <strong>✓</strong> You can submit feedback once your appointment has been confirmed by the doctor.
          </div>
        )}
      </div>
    </div>
  )
}

