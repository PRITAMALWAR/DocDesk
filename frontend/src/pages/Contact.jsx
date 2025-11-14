import React, { useState } from 'react'

export default function Contact(){
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [toasts, setToasts] = useState([])

  const pushToast = (type, text)=>{
    const id = Date.now() + Math.random()
    setToasts(t => [...t, { id, type, text }])
    setTimeout(()=> setToasts(t => t.filter(x => x.id !== id)), 3000)
  }

  const onSubmit = (e)=>{
    e.preventDefault()
    if(!name || !email || !message){
      pushToast('error', 'Please fill all fields')
      return
    }
    pushToast('success', 'Accepted! Your request submitted successfully')
    setName('')
    setEmail('')
    setMessage('')
  }

  return (
    <section className="relative border-b">
      <div className="absolute inset-0">
        <img
          src="https://plus.unsplash.com/premium_photo-1661281397737-9b5d75b52beb?q=80&w=869&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="contact-background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-white/80"/>
      </div>
      <div className="container relative py-12 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl font-bold">Contact Us</h2>
          <p className="text-gray-700 mt-2">Have questions? Reach out and we will get back to you.</p>
          <ul className="mt-6 space-y-2 text-gray-800">
            <li>Email: support@docdesk.local</li>
            <li>Hours: Mon–Fri 9:00–18:00</li>
          </ul>
        </div>
        <form onSubmit={onSubmit} className="card grid gap-3">
          <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Your name" className="border rounded px-3 py-2"/>
          <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Your email" className="border rounded px-3 py-2"/>
          <textarea value={message} onChange={(e)=>setMessage(e.target.value)} placeholder="Message" rows="4" className="border rounded px-3 py-2"/>
          <button className="btn-primary w-max">Send</button>
        </form>
      </div>

      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(t => (
          <div key={t.id} className={`px-4 py-2 rounded shadow text-white ${t.type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}>
            {t.text}
          </div>
        ))}
      </div>
    </section>
  )
}
