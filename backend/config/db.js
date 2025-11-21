import mongoose from "mongoose";

export const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.log("MONGO_URI is missing in .env file");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (err) {
    console.log("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};
