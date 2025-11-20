# DocDesk - Doctor Appointment Platform

<div align="center">

![DocDesk Logo](https://via.placeholder.com/200x60/3B82F6/FFFFFF?text=DocDesk)

**A modern, full-stack web application for managing doctor appointments, medical history, and patient-doctor interactions.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Frontend-3B82F6?style=for-the-badge)](https://docdesk-frontend.onrender.com/)
[![API](https://img.shields.io/badge/API-Backend-10B981?style=for-the-badge)](https://docdesk.onrender.com)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

</div>

## 🎯 About

DocDesk is a comprehensive healthcare management platform that connects patients with doctors, enabling seamless appointment booking, medical history tracking, and feedback systems. Built with modern web technologies, it provides a responsive and intuitive user experience for both patients and healthcare providers.

### Key Highlights

- 🔐 **Secure Authentication** - JWT-based authentication system
- 👨‍⚕️ **Doctor Management** - Complete doctor profiles with specialties and availability
- 📅 **Appointment Booking** - Smart scheduling with validation
- 📋 **Medical History** - Track and manage patient medical records
- ⭐ **Feedback System** - Rate and review doctors
- 📊 **Analytics Dashboard** - Insights for doctors
- 📱 **Responsive Design** - Works seamlessly on all devices

---

## ✨ Features

### Patient Features
- ✅ User registration and authentication
- ✅ Browse doctors by specialty
- ✅ View detailed doctor profiles
- ✅ Book appointments with date/time selection
- ✅ Manage personal appointments
- ✅ Track medical history
- ✅ Submit feedback and ratings
- ✅ View appointment history

### Doctor Features
- ✅ Doctor dashboard with analytics
- ✅ Manage appointment requests
- ✅ View patient list and history
- ✅ Set availability schedule
- ✅ View and respond to feedback
- ✅ Manage profile information

### General Features
- ✅ Real-time appointment status updates
- ✅ Email notifications (optional)
- ✅ Responsive mobile-first design
- ✅ Secure API with CORS protection
- ✅ Error handling and validation
- ✅ Toast notifications for user feedback

---

## 🌐 Live Demo

- **Frontend Application**: [https://docdesk-frontend.onrender.com/](https://docdesk-frontend.onrender.com/)
- **Backend API**: [https://docdesk.onrender.com](https://docdesk.onrender.com)
- **API Health Check**: [https://docdesk.onrender.com/](https://docdesk.onrender.com/)

---

## 🛠 Technologies Used

### Frontend
- **React 18.3.1** - UI library
- **Vite 5.4.8** - Build tool and dev server
- **React Router 6.27.0** - Client-side routing
- **TailwindCSS 3.4.13** - Utility-first CSS framework
- **PostCSS & Autoprefixer** - CSS processing

### Backend
- **Node.js** - Runtime environment
- **Express 4.21.2** - Web framework
- **MongoDB** - Database (MongoDB Atlas)
- **Mongoose 8.19.3** - ODM for MongoDB
- **JWT (jsonwebtoken 9.0.2)** - Authentication
- **bcryptjs 2.4.3** - Password hashing
- **express-validator 7.2.1** - Input validation
- **CORS 2.8.5** - Cross-origin resource sharing
- **Morgan 1.10.0** - HTTP request logger
- **dotenv 16.6.1** - Environment variables

### Development Tools
- **Nodemon 3.1.7** - Auto-restart server
- **ES Modules** - Modern JavaScript modules

---

---


## 📖 Usage

### For Patients

1. **Sign Up/Login**: Create an account or login with existing credentials
2. **Browse Doctors**: Visit the "Doctor List" page to see available doctors
3. **View Profiles**: Click on a doctor to see their profile, specialties, and availability
4. **Book Appointment**: Select date, time, and confirm your appointment
5. **Manage Appointments**: View and manage all your appointments
6. **Medical History**: Track your medical records
7. **Submit Feedback**: Rate and review doctors after appointments

### For Doctors

1. **Login**: Access the doctor dashboard
2. **Dashboard**: View analytics and overview
3. **Manage Requests**: Accept or reject appointment requests
4. **Set Availability**: Configure your available time slots
5. **View Patients**: Access patient list and medical history
6. **Feedback**: View and respond to patient feedback

---

## 📡 API Documentation

### Base URL
```
Production: https://docdesk.onrender.com
Development: http://localhost:5001
```

### Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Endpoints

#### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

#### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get doctor by ID
- `GET /api/doctors/specialty/:specialty` - Get doctors by specialty
- `PUT /api/doctors/profile` - Update doctor profile (doctor only)

#### Appointments
- `POST /api/appointments` - Create appointment (protected)
- `GET /api/appointments` - Get user's appointments (protected)
- `GET /api/appointments/:id` - Get appointment by ID (protected)
- `PUT /api/appointments/:id` - Update appointment status (doctor only)
- `DELETE /api/appointments/:id` - Cancel appointment (protected)

#### Feedback
- `POST /api/feedback` - Submit feedback (protected)
- `GET /api/feedback/doctor/:doctorId` - Get feedback for a doctor
- `GET /api/feedback/user` - Get user's feedback (protected)

#### Medical History
- `GET /api/medical-history` - Get user's medical history (protected)
- `POST /api/medical-history` - Add medical record (protected)

#### Notifications
- `GET /api/notifications` - Get user notifications (protected)

#### Analytics
- `GET /api/analytics` - Get analytics data (doctor only)


## 🚢 Deployment

### Backend Deployment (Render)

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Configure:
   - **Build Command**: `npm install && npm build`
   - **Start Command**: `node server.js`
   - **Environment Variables**: Add all variables from `backend/.env`
4. Deploy

### Frontend Deployment (Render/Vercel/Netlify)

#### Render
1. Create a new Static Site
2. Connect your repository
3. Set build command: `npm run build`
4. Set publish directory: `frontend/dist`
5. Add environment variables


---

## 👤 Contact

**Pritam**

- 🌐 **GitHub**: [@PRITAMALWAR](https://github.com/PRITAMALWAR)
- 📧 **Email**: [thepritamverma@gmai.com]
- 🔗 **Project Link**: [https://github.com/PRITAMALWAR/DocDesk](https://github.com/PRITAMALWAR/DocDesk)



<div align="center">

**Made with ❤️ by Pritam**

⭐ Star this repo if you find it helpful!

</div>
