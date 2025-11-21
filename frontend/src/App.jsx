// Import React and routing components
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

// Import layout components (navbar and footer appear on every page)
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Import all page components
import Home from './pages/Home'
import Services from './pages/Services'
import BookAppointment from './pages/BookAppointment'
import AllAppointments from './pages/AllAppointments'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Signup from './pages/Signup'
import MedicalHistory from './pages/MedicalHistory'
import DoctorProfile from './pages/DoctorProfile'
import DoctorList from './pages/DoctorList'
import PublicDoctorProfile from './pages/PublicDoctorProfile'
import SubmitFeedback from './pages/SubmitFeedback'

// Import doctor-specific components
import DoctorLayout from './layouts/DoctorLayout'
import DoctorDashboard from './pages/doctor/Dashboard'
import DoctorMyAppointments from './pages/doctor/MyAppointments'
import DoctorRequests from './pages/doctor/PendingRequests'
import DoctorPatients from './pages/doctor/PatientsList'
import DoctorAvailability from './pages/doctor/Availability'
import DoctorFeedback from './pages/doctor/Feedback'

// Import authentication context
import { AuthProvider, useAuth } from './context/AuthContext'

// ============================================
// Protected Route Component
// ============================================
// This component checks if user is logged in
// If not logged in, redirect to login page
// If logged in, show the protected content
const ProtectedRoute = ({ children }) => {
  // Get current user from auth context
  const { user } = useAuth()
  
  // If no user, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  // If user exists, show the protected content
  return children
}

// ============================================
// Doctor Route Component
// ============================================
// This component checks if user is a doctor or admin
// Only doctors and admins can access these routes
const DoctorRoute = ({ children }) => {
  // Get current user from auth context
  const { user } = useAuth()
  
  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  // If user is not a doctor or admin, redirect to home
  if (user.role !== 'doctor' && user.role !== 'admin') {
    return <Navigate to="/" replace />
  }
  
  // If user is doctor/admin, show the content
  return children
}

// ============================================
// Main App Component
// ============================================
// This is the root component of our application
// It sets up routing and wraps everything in AuthProvider
export default function App() {
  return (
    // AuthProvider makes user authentication available to all components
    <AuthProvider>
      {/* Main container - min-h-screen makes it full height */}
      <div className="min-h-screen flex flex-col">
        {/* Navbar appears at the top of every page */}
        <Navbar />
        
        {/* Main content area - flex-1 makes it take remaining space */}
        <main className="flex-1">
          {/* Define all routes for the application */}
          <Routes>
            {/* Public Routes - Anyone can access */}
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/doctors" element={<DoctorList />} />
            <Route path="/doctors/:id" element={<PublicDoctorProfile />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected Routes - Must be logged in */}
            <Route path="/book" element={
              <ProtectedRoute>
                <BookAppointment />
              </ProtectedRoute>
            } />
            <Route path="/appointments" element={
              <ProtectedRoute>
                <AllAppointments />
              </ProtectedRoute>
            } />
            <Route path="/medical-history" element={
              <ProtectedRoute>
                <MedicalHistory />
              </ProtectedRoute>
            } />
            <Route path="/feedback/:doctorId" element={
              <ProtectedRoute>
                <SubmitFeedback />
              </ProtectedRoute>
            } />
            
            {/* Doctor Routes - Must be logged in as doctor/admin */}
            <Route path="/doctor" element={
              <DoctorRoute>
                <DoctorLayout />
              </DoctorRoute>
            }>
              {/* Nested routes for doctor dashboard */}
              <Route index element={<DoctorDashboard />} />
              <Route path="home" element={<DoctorDashboard />} />
              <Route path="appointments" element={<DoctorMyAppointments />} />
              <Route path="requests" element={<DoctorRequests />} />
              <Route path="patients" element={<DoctorPatients />} />
              <Route path="availability" element={<DoctorAvailability />} />
              <Route path="feedback" element={<DoctorFeedback />} />
              <Route path="profile" element={<DoctorProfile />} />
            </Route>
            
            {/* Catch-all route - redirect unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        {/* Footer appears at the bottom of every page */}
        <Footer />
      </div>
    </AuthProvider>
  )
}
