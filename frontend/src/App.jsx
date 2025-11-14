import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Services from './pages/Services'
import BookAppointment from './pages/BookAppointment'
import AllAppointments from './pages/AllAppointments'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Signup from './pages/Signup'
import NotFound from './pages/NotFound'
import MedicalHistory from './pages/MedicalHistory'
import DoctorProfile from './pages/DoctorProfile'
import DoctorLayout from './layouts/DoctorLayout'
import DoctorDashboard from './pages/doctor/Dashboard'
import DoctorMyAppointments from './pages/doctor/MyAppointments'
import DoctorRequests from './pages/doctor/PendingRequests'
import DoctorPatients from './pages/doctor/PatientsList'
import DoctorAvailability from './pages/doctor/Availability'
import DoctorFeedback from './pages/doctor/Feedback'
import DoctorList from './pages/DoctorList'
import PublicDoctorProfile from './pages/PublicDoctorProfile'
import { AuthProvider, useAuth } from './context/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return children
}

const DoctorRoute = ({ children }) => {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'doctor' && user.role !== 'admin') return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/book" element={<ProtectedRoute><BookAppointment /></ProtectedRoute>} />
            <Route path="/appointments" element={<ProtectedRoute><AllAppointments /></ProtectedRoute>} />
            <Route path="/medical-history" element={<ProtectedRoute><MedicalHistory /></ProtectedRoute>} />
            <Route path="/doctors" element={<DoctorList />} />
            <Route path="/doctors/:id" element={<PublicDoctorProfile />} />
            <Route path="/doctor" element={<DoctorRoute><DoctorLayout /></DoctorRoute>}>
              <Route index element={<DoctorDashboard />} />
              <Route path="home" element={<DoctorDashboard />} />
              <Route path="appointments" element={<DoctorMyAppointments />} />
              <Route path="requests" element={<DoctorRequests />} />
              <Route path="patients" element={<DoctorPatients />} />
              <Route path="availability" element={<DoctorAvailability />} />
              <Route path="feedback" element={<DoctorFeedback />} />
              <Route path="profile" element={<DoctorProfile />} />
            </Route>
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  )
}
