# 🏥 DocDesk - Doctor Appointment Platform

<div align="center">

![DocDesk Logo](https://via.placeholder.com/200x60/3B82F6/FFFFFF?text=DocDesk)

**A modern, full-stack web application for managing doctor appointments, medical history, and patient-doctor interactions.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Frontend-3B82F6?style=for-the-badge)](https://docdesk-frontend.onrender.com/)
[![API](https://img.shields.io/badge/API-Backend-10B981?style=for-the-badge)](https://docdesk.onrender.com)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Live Demo](#-live-demo)
- [Technologies Used](#-technologies-used)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Screenshots](#-screenshots)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

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

## 📁 Project Structure

```
DocDesk/
├── backend/                    # Backend API Server
│   ├── config/                 # Configuration files
│   │   └── db.js              # MongoDB connection
│   ├── controllers/           # Route controllers
│   │   ├── analyticsController.js
│   │   ├── appointmentController.js
│   │   ├── authController.js
│   │   ├── doctorController.js
│   │   ├── feedbackController.js
│   │   ├── medicalHistoryController.js
│   │   └── notificationController.js
│   ├── middlewares/           # Custom middlewares
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── validationMiddleware.js
│   ├── models/                # Mongoose models
│   │   ├── Appointment.js
│   │   ├── Doctor.js
│   │   ├── Feedback.js
│   │   ├── MedicalHistory.js
│   │   └── User.js
│   ├── routes/                # API routes
│   │   ├── analyticsRoutes.js
│   │   ├── appointmentRoutes.js
│   │   ├── authRoutes.js
│   │   ├── doctorRoutes.js
│   │   ├── feedbackRoutes.js
│   │   ├── medicalHistoryRoutes.js
│   │   └── notificationRoutes.js
│   ├── services/              # Business logic services
│   │   ├── analyticsService.js
│   │   └── emailService.js
│   ├── utils/                 # Utility functions
│   │   ├── dateUtils.js
│   │   ├── generateToken.js
│   │   └── logger.js
│   ├── server.js              # Entry point
│   ├── package.json
│   └── .env                   # Environment variables
│
├── frontend/                  # Frontend React Application
│   ├── src/
│   │   ├── api/              # API client
│   │   │   └── client.js
│   │   ├── components/       # Reusable components
│   │   │   ├── DoctorSidebar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── StarRating.jsx
│   │   │   └── Toast.jsx
│   │   ├── context/          # React Context
│   │   │   └── AuthContext.jsx
│   │   ├── layouts/          # Layout components
│   │   │   └── DoctorLayout.jsx
│   │   ├── pages/            # Page components
│   │   │   ├── doctor/       # Doctor-specific pages
│   │   │   │   ├── Availability.jsx
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── Feedback.jsx
│   │   │   │   ├── MyAppointments.jsx
│   │   │   │   ├── PatientsList.jsx
│   │   │   │   └── PendingRequests.jsx
│   │   │   ├── AllAppointments.jsx
│   │   │   ├── BookAppointment.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── DoctorList.jsx
│   │   │   ├── DoctorProfile.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── MedicalHistory.jsx
│   │   │   ├── NotFound.jsx
│   │   │   ├── PublicDoctorProfile.jsx
│   │   │   ├── Services.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── SubmitFeedback.jsx
│   │   ├── App.jsx           # Main app component
│   │   ├── main.jsx          # Entry point
│   │   └── index.css         # Global styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env                  # Environment variables
│
└── README.md                 # This file
```

---

## 🚀 Installation

### Prerequisites

- **Node.js** 18+ (Node.js 20+ recommended)
- **npm** or **yarn** package manager
- **MongoDB** (local installation or MongoDB Atlas account)

### Step 1: Clone the Repository

```bash
git clone https://github.com/PRITAMALWAR/DocDesk.git
cd DocDesk
```

### Step 2: Install Dependencies

```bash
# Install backend dependencies
npm install --prefix backend

# Install frontend dependencies
npm install --prefix frontend
```

### Step 3: Set Up Environment Variables

#### Backend Configuration

Create a `.env` file in the `backend/` directory:

```env
PORT=5001
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/doctor_app?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
SENDGRID_API_KEY=SG.your_sendgrid_api_key
EMAIL_FROM=no-reply@docdesk.com
```

#### Frontend Configuration

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_BASE=http://localhost:5001
VITE_APP_NAME=DocDesk
VITE_BRAND_LOGO=
VITE_HOME_BG=
VITE_APPOINTMENT_IMG=
VITE_LOGIN_BG=
VITE_SIGNUP_BG=
VITE_404_IMG=
```

> **Note**: Only environment variables prefixed with `VITE_` are exposed to the frontend code.

### Step 4: Run the Application

#### Development Mode

**Terminal 1 - Backend Server:**
```bash
npm run dev --prefix backend
```
Backend will run on `http://localhost:5001` (or your configured PORT)

**Terminal 2 - Frontend Server:**
```bash
npm run dev --prefix frontend
```
Frontend will run on `http://localhost:5173`

#### Production Mode

**Build Frontend:**
```bash
npm run build --prefix frontend
```

**Start Backend:**
```bash
npm start --prefix backend
```

---

## ⚙️ Configuration

### Backend Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port number | No | `5000` |
| `MONGO_URI` | MongoDB connection string | Yes | - |
| `JWT_SECRET` | Secret key for JWT tokens | Yes | - |
| `SENDGRID_API_KEY` | SendGrid API key for emails | No | - |
| `EMAIL_FROM` | Sender email address | No | - |
| `ALLOWED_ORIGINS` | Comma-separated list of allowed origins | No | All origins allowed |

### Frontend Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_API_BASE` | Backend API base URL | Yes | `http://localhost:5025` |
| `VITE_APP_NAME` | Application name | No | `DocDesk` |
| `VITE_BRAND_LOGO` | Logo image URL | No | - |
| `VITE_HOME_BG` | Home page background image | No | - |
| `VITE_APPOINTMENT_IMG` | Appointment page image | No | - |
| `VITE_LOGIN_BG` | Login page background | No | - |
| `VITE_SIGNUP_BG` | Signup page background | No | - |
| `VITE_404_IMG` | 404 page image | No | - |

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

### Example API Request

```javascript
// Register a new user
fetch('https://docdesk.onrender.com/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'securePassword123',
    role: 'patient'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

---

## 📸 Screenshots

### Home Page
![Home Page](https://via.placeholder.com/800x400/3B82F6/FFFFFF?text=Home+Page)

### Doctor List
![Doctor List](https://via.placeholder.com/800x400/10B981/FFFFFF?text=Doctor+List)

### Appointment Booking
![Appointment Booking](https://via.placeholder.com/800x400/F59E0B/FFFFFF?text=Book+Appointment)

### Doctor Dashboard
![Doctor Dashboard](https://via.placeholder.com/800x400/EF4444/FFFFFF?text=Doctor+Dashboard)

### Medical History
![Medical History](https://via.placeholder.com/800x400/8B5CF6/FFFFFF?text=Medical+History)

> **Note**: Replace these placeholder images with actual screenshots of your application.

---

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

#### Vercel
```bash
cd frontend
vercel
```

#### Netlify
```bash
cd frontend
netlify deploy --prod
```

### MongoDB Atlas Setup

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Add your IP address to the whitelist (or use `0.0.0.0/0` for all IPs)
4. Create a database user
5. Get your connection string and add it to `MONGO_URI`

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Contribution Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation if needed

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Contact

**Pritam Kumar**

- 🌐 **GitHub**: [@PRITAMALWAR](https://github.com/PRITAMALWAR)
- 📧 **Email**: [Add your email here]
- 🔗 **Project Link**: [https://github.com/PRITAMALWAR/DocDesk](https://github.com/PRITAMALWAR/DocDesk)

---

## 🙏 Acknowledgments

- Thanks to all the open-source libraries and frameworks that made this project possible
- MongoDB Atlas for providing database hosting
- Render for hosting services

---

<div align="center">

**Made with ❤️ by Pritam Kumar**

⭐ Star this repo if you find it helpful!

</div>
