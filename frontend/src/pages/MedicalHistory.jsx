import React, { useEffect, useState } from 'react'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'

export default function MedicalHistory(){
  const { user } = useAuth()
  const [list, setList] = useState([])
  const [notes, setNotes] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editNotes, setEditNotes] = useState('')
  const [confirmId, setConfirmId] = useState(null)
  const [toasts, setToasts] = useState([])

  const pushToast = (type, message)=>{
    const id = Date.now() + Math.random()
    setToasts(t => [...t, { id, type, message }])
    setTimeout(()=>{
      setToasts(t => t.filter(x => x.id !== id))
    }, 3000)
  }

  const load = async ()=>{
    try{
      const data = await api('/api/medical-history/me', { token: user?.token })
      setList(data)
    }catch(e){
      pushToast('error', 'Failed to load medical history')
    }
  }

  useEffect(()=>{ if(user?.token) load() },[user?.token])

  const add = async (e)=>{
    e.preventDefault()
    if(!notes) return
    try{
      await api('/api/medical-history', { method: 'POST', token: user?.token, body: { notes } })
      setNotes('')
      pushToast('success', 'Note added')
      load()
    }catch(e){
      pushToast('error', 'Failed to add note')
    }
  }

  const startEdit = (item)=>{
    setEditingId(item._id)
    setEditNotes(item.notes)
  }

  const cancelEdit = ()=>{
    setEditingId(null)
    setEditNotes('')
  }

  const saveEdit = async (id)=>{
    if(!editNotes) return
    try{
      await api(`/api/medical-history/${id}`, { method: 'PATCH', token: user?.token, body: { notes: editNotes } })
      pushToast('success', 'Note updated')
      cancelEdit()
      load()
    }catch(e){
      pushToast('error', 'Failed to update note')
    }
  }

  const askDelete = (id)=> setConfirmId(id)

  const cancelDelete = ()=> setConfirmId(null)

  const confirmDelete = async ()=>{
    const id = confirmId
    if(!id) return
    try{
      await api(`/api/medical-history/${id}`, { method: 'DELETE', token: user?.token })
      if (editingId === id) cancelEdit()
      pushToast('success', 'Note deleted')
      load()
    }catch(e){
      pushToast('error', 'Failed to delete note')
    }finally{
      setConfirmId(null)
    }
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
            {editingId === item._id ? (
              <div className="mt-2 grid gap-2">
                <textarea rows="3" value={editNotes} onChange={(e)=>setEditNotes(e.target.value)} className="border rounded px-3 py-2"/>
                <div className="flex gap-2">
                  <button type="button" onClick={()=>saveEdit(item._id)} className="btn-primary">Save</button>
                  <button type="button" onClick={cancelEdit} className="btn-secondary">Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div className="mt-2 whitespace-pre-wrap">{item.notes}</div>
                <div className="mt-3 flex gap-2">
                  <button type="button" onClick={()=>startEdit(item)} className="btn-secondary">Edit</button>
                  <button type="button" onClick={()=>askDelete(item._id)} className="btn-danger">Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Toasts */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(t => (
          <div key={t.id} className={`px-4 py-2 rounded shadow text-white ${t.type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}>
            {t.message}
          </div>
        ))}
      </div>

      {/* Confirm Modal */}
      {confirmId && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-2">Delete note?</h3>
            <p className="text-sm text-gray-600 mb-4">This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <button type="button" className="btn-secondary" onClick={cancelDelete}>Cancel</button>
              <button type="button" className="btn-danger" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
