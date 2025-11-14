import React from 'react'

const img = import.meta.env.VITE_404_IMG

export default function NotFound(){
  return (
    <div className="container py-16 text-center">
      <img src={img} alt="404" className="mx-auto max-w-md rounded"/>
      <h2 className="text-2xl font-bold mt-6">Page not found</h2>
      <p className="text-gray-600 mt-2">The page you are looking for does not exist.</p>
      <a href="/" className="btn-primary inline-block mt-6">Go Home</a>
    </div>
  )
}
