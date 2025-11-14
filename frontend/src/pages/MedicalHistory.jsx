import React, { useEffect, useState } from 'react'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'

export default function MedicalHistory(){
  const { user } = useAuth()
  const [list, setList] = useState([])
  const [notes, setNotes] = useState('')

  const load = async ()=>{
    try{
      const data = await api('/api/medical-history/me', { token: user?.token })
      setList(data)
    }catch{}
  }

  useEffect(()=>{ load() },[])

  const add = async (e)=>{
    e.preventDefault()
    if(!notes) return
    await api('/api/medical-history', { method: 'POST', token: user?.token, body: { notes } })
    setNotes('')
    load()
  }

  return (
    <div className="container py-10">
      <h2 className="text-2xl font-bold mb-4">My Medical History</h2>
      <form onSubmit={add} className="card grid gap-3 mb-6">
        <textarea rows="3" value={notes} onChange={(e)=>setNotes(e.target.value)} placeholder="Add a note..." className="border rounded px-3 py-2"/>
        <button className="btn-primary w-max">Add Note</button>
      </form>
      <div className="grid gap-3">
        {list.map(item => (
          <div key={item._id} className="card">
            <div className="text-sm text-gray-500">{new Date(item.createdAt).toLocaleString()}</div>
            <div className="mt-2 whitespace-pre-wrap">{item.notes}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
