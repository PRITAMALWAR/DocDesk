// Import required packages
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';

// Import database connection function
import { connectDB } from './config/db.js';

// Import all route files
import authRoutes from './routes/authRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import medicalHistoryRoutes from './routes/medicalHistoryRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

// Import error handling middlewares
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';

// Load environment variables from .env file
dotenv.config();

// Create Express application
const app = express();

// ============================================
// CORS Configuration
// ============================================
// CORS (Cross-Origin Resource Sharing) allows our frontend to make requests
// to the backend even though they're on different domains/ports
// This is a custom CORS handler to allow all origins for development
app.use((req, res, next) => {
  // Get the origin of the request (where the request is coming from)
  const origin = req.headers.origin;
  
  // Allow all origins for development
  // In production, you can set ALLOWED_ORIGINS env var to restrict this
  if (origin || !process.env.ALLOWED_ORIGINS) {
    // Allow the request origin, or allow all if no origin specified
    res.header('Access-Control-Allow-Origin', origin || '*');
  } else {
    // If ALLOWED_ORIGINS is set, check if the origin is allowed
    const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim());
    if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      res.header('Access-Control-Allow-Origin', origin);
    }
  }
  
  // Allow credentials (cookies, authorization headers, etc.)
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Allow these HTTP methods
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD');
  
  // Get the headers that the client wants to send
  const requestedHeaders = req.headers['access-control-request-headers'];
  if (requestedHeaders) {
    // Allow whatever headers the client requests
    res.header('Access-Control-Allow-Headers', requestedHeaders);
  } else {
    // Default allowed headers
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Cache-Control, Pragma, Accept, Origin');
  }
  
  // Expose the Authorization header so frontend can read it
  res.header('Access-Control-Expose-Headers', 'Authorization');
  
  // Handle preflight requests (OPTIONS method)
  // Browsers send this before the actual request to check if it's allowed
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204); // No content, but success
  }
  
  // Continue to the next middleware
  next();
});

// Also use the cors package as a fallback
app.use(cors({
  origin: true, // Allow all origins
  credentials: true // Allow credentials
}));

// ============================================
// Middleware Setup
// ============================================
// Parse JSON request bodies (convert JSON strings to JavaScript objects)
app.use(express.json());

// Log HTTP requests to console (useful for debugging)
app.use(morgan('dev'));

// ============================================
// Cache Control
// ============================================
// Disable ETags (entity tags) to prevent 304 Not Modified responses
// This ensures we always get fresh data from the API
app.disable('etag');

// Set cache control headers for all responses
app.use((req, res, next) => {
  // Tell browsers not to cache API responses
  res.set('Cache-Control', 'no-store');
  next();
});

// ============================================
// Database Connection
// ============================================
// Connect to MongoDB database
connectDB();

// ============================================
// Routes
// ============================================
// Health check endpoint - just to verify server is running
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Doctor Appointment API' 
  });
});

// Mount all API routes
// Each route file handles a specific part of the API
app.use('/api/auth', authRoutes);              // Authentication routes (login, register)
app.use('/api/doctors', doctorRoutes);         // Doctor-related routes
app.use('/api/appointments', appointmentRoutes); // Appointment routes
app.use('/api/feedback', feedbackRoutes);      // Feedback routes
app.use('/api/medical-history', medicalHistoryRoutes); // Medical history routes
app.use('/api/notifications', notificationRoutes); // Notification routes
app.use('/api/analytics', analyticsRoutes);     // Analytics routes

// ============================================
// Error Handling
// ============================================
// These must be last, after all routes
// Handle 404 errors (route not found)
app.use(notFound);

// Handle all other errors
app.use(errorHandler);

// ============================================
// Start Server
// ============================================
// Get port from environment variable or use default 5000
const PORT = process.env.PORT || 5000;

// Start listening on the specified port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
