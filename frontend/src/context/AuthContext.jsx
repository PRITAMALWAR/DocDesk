import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthCtx = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('dd_user')
    return raw ? JSON.parse(raw) : null
  })

  useEffect(() => {
    if (user) localStorage.setItem('dd_user', JSON.stringify(user))
    else localStorage.removeItem('dd_user')
  }, [user])

  const value = useMemo(() => ({ user, setUser }), [user])
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

export const useAuth = () => useContext(AuthCtx)
