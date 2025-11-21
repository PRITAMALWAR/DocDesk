// Import mongoose for database schema
import mongoose from 'mongoose';
// Import bcrypt for password hashing
import bcrypt from 'bcryptjs';

// ============================================
// User Schema Definition
// ============================================
// This defines the structure of a User document in MongoDB
const userSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true  // Name is required
    },
    email: { 
      type: String, 
      required: true,   // Email is required
      unique: true,     // No two users can have the same email
      lowercase: true   // Convert email to lowercase
    },
    password: { 
      type: String, 
      required: true  // Password is required
    },
    role: { 
      type: String, 
      enum: ['patient', 'doctor', 'admin'],  // Only these roles are allowed
      default: 'patient'  // Default role is 'patient'
    }
  },
  { 
    timestamps: true  // Automatically add createdAt and updatedAt fields
  }
);

// ============================================
// Password Hashing Middleware
// ============================================
// This runs before saving a user to the database
// It hashes the password so we don't store plain text passwords
userSchema.pre('save', async function (next) {
  // Only hash password if it's been modified (or is new)
  // This prevents re-hashing on every save
  if (!this.isModified('password')) {
    return next(); // Skip hashing if password hasn't changed
  }
  
  // Generate a salt (random string) to make hashing more secure
  const salt = await bcrypt.genSalt(10);
  
  // Hash the password with the salt
  this.password = await bcrypt.hash(this.password, salt);
  
  // Continue with saving
  next();
});

// ============================================
// Password Matching Method
// ============================================
// This method compares a plain text password with the hashed password
// Returns true if they match, false otherwise
userSchema.methods.matchPassword = async function (enteredPassword) {
  // Compare the entered password with the stored hashed password
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create and export the User model
// This allows us to create, read, update, and delete User documents
export default mongoose.model('User', userSchema);
