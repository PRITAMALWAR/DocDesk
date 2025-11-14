import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI missing');
    process.exit(1);
  }
  try {
    const conn = await mongoose.connect(uri, { dbName: uri.split('/').pop() });
    console.log(`MongoDB connected: ${conn.connection.host} successfully`);
  } catch (err) {
    console.error('MongoDB connection error', err.message);
    process.exit(1);
  }
};
