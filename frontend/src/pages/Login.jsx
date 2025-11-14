import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'
import Toast from '../components/Toast'

const brand = import.meta.env.VITE_APP_NAME || 'DocDesk'
const logo = import.meta.env.VITE_BRAND_LOGO

export default function Login(){
  const { setUser } = useAuth()
  const nav = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)
  const [success, setSuccess] = useState('')
  const [fieldErr, setFieldErr] = useState({ email: '', password: '' })

  const submit = async (e)=>{
    e.preventDefault()
    setError('')
    setFieldErr({ email: '', password: '' })
    let hasErr = false
    if(!form.email){ setFieldErr(f=>({...f, email: 'Email is required'})); hasErr = true }
    else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)){ setFieldErr(f=>({...f, email: 'Enter a valid email'})); hasErr = true }
    if(!form.password){ setFieldErr(f=>({...f, password: 'Password is required'})); hasErr = true }
    if (hasErr) return
    setLoading(true)
    try{
      const res = await api('/api/auth/login', { method: 'POST', body: form })
      setUser(res)
      setSuccess('Logged in successfully')
      setTimeout(()=> nav('/'), 800)
    }catch(e){ setError('Invalid credentials') }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 p-6">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3">
            {logo && <img src={logo} alt={brand} className="w-10 h-10 object-contain"/>}
            <div className="text-2xl font-extrabold text-primary-600">{brand}</div>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">Sign in</h2>
          <p className="text-gray-600 mt-1">Access your DocDesk account</p>
        </div>
        {error && <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">{error}</div>}
        <form onSubmit={submit} className="mt-6 grid gap-4">
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
          <button disabled={loading} className="btn-primary w-full mt-2 disabled:opacity-70">{loading? 'Signing in...' : 'Login'}</button>
        </form>
        <div className="text-sm text-gray-700 mt-5 text-center">No account? <Link to="/signup" className="text-primary-600 font-semibold">Create one</Link></div>
      </div>
      <Toast kind="success" message={success} onClose={()=>setSuccess('')} />
    </div>
  )
}
