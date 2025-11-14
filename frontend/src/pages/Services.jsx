import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Services(){
  const navigate = useNavigate()
  const { user } = useAuth() || {}
  const items = [
    { title: 'Book Appointments', desc: 'Find doctors by specialty, see availability, and book instantly.' },
    { title: 'Smart Notifications', desc: 'Automatic email notifications for confirmations and updates.' },
    { title: 'Medical History', desc: 'Keep your notes and history organized for quick access.' },
    { title: 'Doctor Ratings', desc: 'Rate and review your experience to help others choose.' },
  ]
  const images = [
    'https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519494080410-f9aa76cb4283?q=80&w=1200&auto=format&fit=crop'
  ]
  const specialties = ['Cardiology','Dermatology','Pediatrics','Orthopedics','Neurology','ENT','Gynecology','Psychiatry']
  const faqs = [
    { q: 'How do I book an appointment?', a: 'Go to Book Appointment, choose a doctor, select date/time, and confirm.' },
    { q: 'Can I cancel or reschedule?', a: 'Yes, from the Appointments page depending on status and provider policies.' },
    { q: 'Will I get reminders?', a: 'Yes, DocDesk sends email notifications for confirmations and updates.' },
  ]
  return (
    <div>
      {/* Hero */}
      <section className="relative border-b">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?q=80&w=2400&auto=format&fit=crop" alt="services-hero" className="w-full h-full object-cover"/>
          <div className="absolute inset-0 bg-white/80"/>
        </div>
        <div className="relative container py-12">
          <h2 className="text-3xl font-bold">Our Services</h2>
          <p className="text-gray-700 mt-2">All the tools you need for a smooth healthcare journey.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {items.map((it, idx)=> (
              <div key={it.title} className="card p-0 overflow-hidden">
                <div className="h-36 w-full overflow-hidden">
                  <img src={images[idx % images.length]} alt={it.title} className="w-full h-full object-cover"/>
                </div>
                <div className="p-6">
                  <div className="font-semibold text-lg">{it.title}</div>
                  <p className="text-gray-600 mt-2">{it.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialties */}
      <section className="bg-gray-50 border-b">
        <div className="container py-12">
          <h3 className="text-2xl font-bold">Popular Specialties</h3>
          <p className="text-gray-600 mt-2">Quickly find the right specialist.</p>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            {specialties.map(s => (
              <div key={s} className="border bg-white rounded-lg px-4 py-3 text-gray-700 hover:shadow transition">{s}</div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white border-b">
        <div className="container py-12">
          <h3 className="text-2xl font-bold">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <div className="card">
              <div className="text-primary-600 font-semibold">Step 1</div>
              <div className="font-bold text-lg mt-1">Search & Choose</div>
              <p className="text-gray-600 mt-2">Browse doctors by specialty, rating, and availability.</p>
            </div>
            <div className="card">
              <div className="text-primary-600 font-semibold">Step 2</div>
              <div className="font-bold text-lg mt-1">Pick a Slot</div>
              <p className="text-gray-600 mt-2">Select a date and time that works for you.</p>
            </div>
            <div className="card">
              <div className="text-primary-600 font-semibold">Step 3</div>
              <div className="font-bold text-lg mt-1">Confirm & Attend</div>
              <p className="text-gray-600 mt-2">Get instant confirmation and reminders via email.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gray-50 border-b">
        <div className="container py-12 grid sm:grid-cols-3 gap-6 text-center">
          <div className="card">
            <div className="text-3xl font-extrabold text-primary-600">5k+</div>
            <div className="text-gray-600">Appointments booked</div>
          </div>
          <div className="card">
            <div className="text-3xl font-extrabold text-primary-600">300+</div>
            <div className="text-gray-600">Verified doctors</div>
          </div>
          <div className="card">
            <div className="text-3xl font-extrabold text-primary-600">4.8/5</div>
            <div className="text-gray-600">Average rating</div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white border-b">
        <div className="container py-12">
          <h3 className="text-2xl font-bold">Frequently Asked Questions</h3>
          <div className="mt-6 grid md:grid-cols-2 gap-6">
            {faqs.map((f, idx)=> (
              <div key={idx} className="card">
                <div className="font-semibold">{f.q}</div>
                <p className="text-gray-600 mt-2">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white">
        <div className="container py-16 grid md:grid-cols-2 items-center gap-8">
          <div className="h-56 md:h-72 rounded-xl overflow-hidden shadow ring-1 ring-black/5">
            <img src="https://plus.unsplash.com/premium_photo-1681843126728-04eab730febe?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="services-cta" className="w-full h-full object-cover"/>
          </div>
          <div>
            <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900">Ready to get started?</h3>
            <p className="mt-3 text-gray-600 text-lg">Create an account and book your first appointment in minutes.</p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => navigate(user ? '/' : '/signup')}
                className="btn-primary"
              >
                Create free account
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
