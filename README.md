# DocDesk — Doctor Appointment Platform

A full‑stack web application for discovering doctors, booking appointments, managing medical history, and receiving notifications. Built with a modern React frontend and a Node.js/Express API backed by MongoDB.


## Features
- Patient authentication with JWT
- Browse doctors by specialty and profile
- Book appointments with weekday/slot validation
- Feedback and ratings
- Medical history management
- Notifications/analytics endpoints (extensible)
- Clean, responsive UI (TailwindCSS)


## Tech Stack
- Frontend: Vite + React, React Router, TailwindCSS
- Backend: Node.js, Express, Mongoose
- Database: MongoDB (local or Atlas)
- Tooling: Nodemon (dev), morgan, cors, dotenv


## Monorepo Structure
```
DOCTOR/
├─ backend/
│  ├─ server.js
│  ├─ config/
│  ├─ controllers/
│  ├─ middlewares/
│  ├─ models/
│  ├─ routes/
│  └─ .env
├─ frontend/
│  ├─ src/
│  ├─ index.html
│  └─ .env.local
└─ README.md
```


## Prerequisites
- Node.js 18+ (Node 20 recommended)
- npm or yarn
- MongoDB running locally (default) or a MongoDB Atlas connection URI


## Quick Start
1) Clone and install
```
# from DOCTOR/
npm install --prefix backend
npm install --prefix frontend
```

2) Configure environment variables
- backend/.env
```
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/doctor_app
JWT_SECRET=change_this_secret
SENDGRID_API_KEY=SG.xxxxxx
EMAIL_FROM=no-reply@doctorapp.local
```
- frontend/.env.local
```
VITE_API_BASE=http://localhost:5001
VITE_APP_NAME=DocDesk
VITE_BRAND_LOGO=...
VITE_HOME_BG=...
VITE_APPOINTMENT_IMG=...
VITE_LOGIN_BG=...
VITE_SIGNUP_BG=...
VITE_404_IMG=...
```
Note: Only variables prefixed with VITE_ are exposed to the frontend.

3) Run dev servers
```
# Terminal A
npm run dev --prefix backend
# or
npx nodemon server.js --prefix backend

# Terminal B
npm run dev --prefix frontend
```
Frontend dev server will usually be at http://localhost:5173 (Vite).
Backend runs at http://localhost:${PORT} (default shown above: 5001).


## Scripts
- Backend
  - `npm run dev` — Start API with nodemon
  - `npm start` — Start API with node
- Frontend
  - `npm run dev` — Start Vite dev server
  - `npm run build` — Production build
  - `npm run preview` — Preview build locally


## Backend Overview
- Entry: `backend/server.js`
- Middleware: CORS, JSON body, morgan, 304 disabled for API responses
- DB: `backend/config/db.js` handles Mongoose connection
- Error handling: `middlewares/errorMiddleware.js`

Mounted route prefixes:
- `GET /` — Health/status
- `POST /api/auth/...` — Authentication
- `GET  /api/doctors` and related — Doctors
- `POST /api/appointments` and related — Appointments
- `POST /api/feedback` and related — Feedback
- `GET  /api/medical-history` and related — Medical history
- `GET  /api/notifications` and related — Notifications
- `GET  /api/analytics` and related — Analytics

Note: See controllers and routes directories for exact endpoints, payloads, and status codes.


## Frontend Overview
- Vite + React in `frontend/src`
- Global API client: `src/api/client.js`
  - Reads base URL from `VITE_API_BASE`
- Auth context: `src/context/AuthContext.jsx`
  - Persists `user` in `localStorage` key `dd_user`
- Key pages
  - Home: `src/pages/Home.jsx`
  - Services: `src/pages/Services.jsx`
  - Book Appointment: `src/pages/BookAppointment.jsx`
  - Doctor Profile: `src/pages/DoctorProfile.jsx`
  - Contact: `src/pages/Contact.jsx`
  - Not Found: `src/pages/NotFound.jsx`


## Environment Variables
- Backend `.env`
  - `PORT` — API port (e.g., 5001)
  - `MONGO_URI` — MongoDB connection string
  - `JWT_SECRET` — Secret for signing tokens
  - `SENDGRID_API_KEY`, `EMAIL_FROM` — for email notifications (optional)

- Frontend `.env.local`
  - `VITE_API_BASE` — Base URL of backend (e.g., http://localhost:5001)
  - Various `VITE_...` image/brand variables for UI


## Development Notes
- Port usage
  - If you see EADDRINUSE on port 5000/5001, either kill the running process or switch ports:
    - One-off: `PORT=5002 npm run dev --prefix backend`
    - Persistent: change `PORT` in `backend/.env` and update `VITE_API_BASE` in `frontend/.env.local`

- Data model
  - See `backend/models/*.js` for `Doctor`, `Appointment`, `Feedback`, etc.

- Auth
  - JWT-based; attach token as `Authorization: Bearer <token>`


## API Usage Examples
- Fetch doctors
```
GET /api/doctors
```
- Create appointment
```
POST /api/appointments
Authorization: Bearer <token>
Content-Type: application/json
{
  "doctorId": "<id>",
  "date": "YYYY-MM-DD",
  "weekday": "Mon",
  "time": "10:30"
}
```


## Building for Production
- Frontend
```
npm run build --prefix frontend
```
Outputs static assets in `frontend/dist`.

- Backend
```
NODE_ENV=production node backend/server.js
```

Deploy suggestions
- Frontend: Netlify, Vercel, or any static host
- Backend: Render, Railway, Fly.io, or a VPS (expose `PORT` and set env vars)


## Troubleshooting
- API port already in use
  - Find process: `lsof -iTCP:<PORT> -sTCP:LISTEN -n -P`
  - Kill process: `kill -TERM <PID>` (or `kill -9 <PID>` if needed)
- CORS/network
  - Ensure `VITE_API_BASE` points to the correct backend URL
- MongoDB connection
  - Check `MONGO_URI`, database is running, and network accessible


## Contributing
- Follow existing code style and component structure
- Keep imports at the top of files
- Use meaningful commit messages


## License @Pritam
This project is provided as-is for demonstration and educational purposes. Add a license if you plan to distribute.
