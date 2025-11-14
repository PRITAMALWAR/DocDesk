import React from 'react'
import { Link } from 'react-router-dom'

const bg = import.meta.env.VITE_HOME_BG

export default function Home() {
  return (
    <div>
      <section className="relative border-b">
        <div className="absolute inset-0">
          <img src={bg} alt="home-hero" className="w-full h-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 to-white/40" />
        </div>
        <div className="container relative py-20 md:py-28">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">Book the right doctor, right now</h1>
            <p className="mt-4 text-gray-700 text-lg">Search by specialty or name and schedule in seconds.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]">
              <Link to="/doctors" className="px-4 py-3 rounded-md border bg-white/90 hover:bg-white shadow text-gray-700">Browse Doctors</Link>
              <Link to="/book" className="btn-primary">Book Appointment</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border-b">
        <div className="container py-10">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[{ k: '5k+', l: 'Appointments' }, { k: '300+', l: 'Doctors' }, { k: '4.8/5', l: 'Rating' }, { k: 'Secure', l: 'Records' }].map(x => (
              <div key={x.l} className="card text-center">
                <div className="text-3xl font-extrabold text-primary-600">{x.k}</div>
                <div className="text-gray-600">{x.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 border-b">
        <div className="container py-12">
          <h3 className="text-2xl font-bold">Popular specialties</h3>
          <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {["Cardiology", "Dermatology", "Pediatrics", "Orthopedics", "ENT", "Gynecology", "Psychiatry", "Dentistry"].map(s => (
              <Link key={s} to={`/doctors?specialty=${encodeURIComponent(s)}`} className="card hover:shadow-md transition">
                <div className="font-semibold">{s}</div>
                <div className="text-sm text-gray-600 mt-1">Find top {s.toLowerCase()} near you</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white border-b">
        <div className="container py-12 grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h3 className="text-2xl font-bold">Seamless experience</h3>
            <p className="text-gray-600 mt-3">Fast booking, secure records, and clear communication with your care team.</p>
            <div className="mt-5 flex gap-3">
              <Link to="/services" className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50">Explore Services</Link>
            </div>
          </div>
          <div className="h-128 md:h-64 rounded-lg overflow-hidden shadow img-cover">
            <img
              src="https://plus.unsplash.com/premium_photo-1673958772336-764ff8ebb9c5?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="seamless"
              className="w-full h-full object-cover object-top"
            />
          </div>

        </div>
      </section>

      <section className="bg-white">
        <div className="container py-16 grid md:grid-cols-2 items-center gap-8">
          <div className="h-56 md:h-72 rounded-xl overflow-hidden shadow ring-1 ring-black/5">
            <img src="https://plus.unsplash.com/premium_photo-1681966997732-c50801190d12?q=80&w=930&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="book-visit" className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900">Ready to book your visit?</h3>
            <p className="mt-3 text-gray-600 text-lg">Manage appointments easily and receive timely reminders—all in one place.</p>
            <div className="mt-6">
              <Link to="/book" className="btn-primary">Book Now</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

