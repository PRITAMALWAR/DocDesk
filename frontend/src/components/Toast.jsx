import React, { useEffect } from 'react'

export default function Toast({ kind = 'success', message = '', onClose, duration = 2500 }){
  useEffect(()=>{
    if(!message) return
    const t = setTimeout(()=> onClose && onClose(), duration)
    return ()=> clearTimeout(t)
  },[message, duration, onClose])

  if(!message) return null
  const base = kind === 'success' ? 'bg-emerald-600' : 'bg-red-600'
  return (
    <div className={`fixed top-4 right-4 z-50 text-white ${base} shadow-lg rounded-lg px-4 py-3`}> 
      {message}
    </div>
  )
}
