import jwt from 'jsonwebtoken';
import User from '../models/User.js';


export const protect = async (req, res, next) => {
  let token;
  
 
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  if (!token) {
    return res.status(401).json({ 
      message: 'Not authorized, no token provided' 
    });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
  
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        message: 'User not found' 
      });
    }
    
    // Attach user to request object so routes can access it
    req.user = user;
    
    // Continue to the next middleware or route handler
    next();
    
  } catch (error) {
    // Token is invalid or expired
    console.error('Token verification error:', error);
    return res.status(401).json({ 
      message: 'Not authorized, invalid token' 
    });
  }
};

// ============================================
// Authorize Middleware
// ============================================
// This middleware checks if user has the required role
// Must be used AFTER protect middleware (so req.user exists)
export const authorize = (...roles) => {
  return (req, res, next) => {
    // Check if user exists and has one of the required roles
    if (!req.user) {
      return res.status(401).json({ 
        message: 'Not authenticated' 
      });
    }
    
    if (!roles.includes(req.user.role)) {
      // User doesn't have required role
      return res.status(403).json({ 
        message: 'Access forbidden. Required role: ' + roles.join(' or ') 
      });
    }
    
    // User has required role, continue
    next();
  };
};
