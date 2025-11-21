// Import JWT library for creating tokens
import jwt from 'jsonwebtoken';

// ============================================
// Generate JWT Token
// ============================================
// This function creates a JWT token for a user
// The token contains the user's ID and role
// Tokens expire after 7 days for security
export const generateToken = (id, role) => {
  // Create the token payload (data stored in token)
  const payload = {
    id: id,      // User's MongoDB _id
    role: role   // User's role (patient, doctor, or admin)
  };
  
  // Sign the token with our secret key
  // expiresIn: '7d' means token is valid for 7 days
  const token = jwt.sign(
    payload, 
    process.env.JWT_SECRET,  // Secret key from environment variables
    { expiresIn: '7d' }      // Token expires in 7 days
  );
  
  return token;
};
