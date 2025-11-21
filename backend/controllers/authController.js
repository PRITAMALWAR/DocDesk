// Import the User model (database schema)
import User from '../models/User.js';
// Import function to generate JWT tokens
import { generateToken } from '../utils/generateToken.js';

// ============================================
// Register a new user
// ============================================
export const register = async (req, res) => {
  try {
    // Get user data from request body
    const { name, email, password, role } = req.body;
    
    // Check if user with this email already exists
    const existingUser = await User.findOne({ email: email });
    
    if (existingUser) {
      // User already exists, return error
      return res.status(400).json({ 
        message: 'User already exists with this email' 
      });
    }
    
    // Create new user in database
    // The password will be automatically hashed by the User model
    console.log('Creating new user with email:', email);
    const newUser = await User.create({ 
      name: name, 
      email: email, 
      password: password, 
      role: role || 'patient' // Default role is 'patient' if not specified
    });
    
    console.log('User created successfully:', newUser._id);
    
    // Generate JWT token for the new user
    const token = generateToken(newUser._id, newUser.role);
    console.log('Token generated for user');
    
    // Return user data (without password) and token
    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      token: token
    });
    
  } catch (error) {
    // If something goes wrong, return error
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Error creating user', 
      error: error.message 
    });
  }
};

// ============================================
// Login existing user
// ============================================
export const login = async (req, res) => {
  try {
    // Get email and password from request
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email: email });
    
    // Check if user exists and password matches
    if (user && await user.matchPassword(password)) {
      console.log('Login successful for user:', user.email);
      // Password is correct, generate token
      const token = generateToken(user._id, user.role);
      
      // Return user data and token
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: token
      });
    } else {
      // Invalid credentials
      res.status(401).json({ 
        message: 'Invalid email or password' 
      });
    }
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Error during login', 
      error: error.message 
    });
  }
};

// ============================================
// Get current logged-in user
// ============================================
// This route is protected, so req.user is set by authMiddleware
export const me = async (req, res) => {
  try {
    // req.user is set by the authMiddleware after verifying the token
    // Just return the user data
    res.json(req.user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      message: 'Error getting user data', 
      error: error.message 
    });
  }
};
