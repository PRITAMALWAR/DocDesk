import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

// Create a context for authentication
// This will store the current user information
const AuthContext = createContext(null)

// This component provides authentication state to all child components
export const AuthProvider = ({ children }) => {
  // Initialize user state from localStorage if it exists
  // This way user stays logged in even after page refresh
  const [user, setUser] = useState(() => {
    try {
      // Get user data from localStorage
      const userData = localStorage.getItem('dd_user')
      // If user data exists, parse it from JSON string
      if (userData) {
        return JSON.parse(userData)
      }
      // Otherwise return null (no user logged in)
      return null
    } catch (error) {
      // If there's an error parsing, just return null
      console.error('Error loading user from localStorage:', error)
      return null
    }
  })

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      // If user exists, save it to localStorage
      localStorage.setItem('dd_user', JSON.stringify(user))
    } else {
      // If no user, remove from localStorage
      localStorage.removeItem('dd_user')
    }
  }, [user]) // Run this effect whenever user changes

  // Create the value object that will be provided to all children
  // useMemo prevents unnecessary re-renders
  const value = useMemo(() => ({ 
    user: user,      // Current user object
    setUser: setUser // Function to update user
  }), [user])

  // Provide the auth context to all children
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to easily access auth context in any component
// Instead of using useContext(AuthContext) everywhere, we use useAuth()
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    // This shouldn't happen, but just in case
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
