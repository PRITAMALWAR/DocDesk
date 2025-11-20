import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI missing');
    process.exit(1);
  }

  // MongoDB connection options optimized for Atlas
  const options = {
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    retryWrites: true,
    w: 'majority',
  };

  // Extract database name from URI if present
  try {
    const url = new URL(uri);
    const dbName = url.pathname.slice(1) || 'doctor_app';
    options.dbName = dbName;
  } catch (e) {
    // If URI parsing fails, try to extract from connection string
    const dbMatch = uri.match(/\/([^?]+)/);
    if (dbMatch) {
      options.dbName = dbMatch[1];
    }
  }

  let retries = 5;
  let retryDelay = 3000; // 3 seconds

  while (retries > 0) {
    try {
      const conn = await mongoose.connect(uri, options);
      console.log(`MongoDB connected: ${conn.connection.host} successfully`);
      return;
    } catch (err) {
      retries--;
      console.error(`MongoDB connection error: ${err.message}`);
      
      if (retries === 0) {
        console.error('\n❌ Failed to connect to MongoDB after multiple attempts.');
        console.error('\n📋 To fix this issue:');
        console.error('1. Go to MongoDB Atlas: https://cloud.mongodb.com/');
        console.error('2. Navigate to Network Access (Security > Network Access)');
        console.error('3. Click "Add IP Address"');
        console.error('4. Click "Allow Access from Anywhere" (0.0.0.0/0)');
        console.error('   OR add Render\'s IP ranges if you prefer to restrict access');
        console.error('5. Wait a few minutes for changes to propagate');
        console.error('\n⚠️  Make sure your MONGO_URI environment variable is set correctly in Render.');
        process.exit(1);
      }
      
      console.log(`Retrying connection in ${retryDelay / 1000} seconds... (${retries} attempts remaining)`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      retryDelay *= 1.5; // Exponential backoff
    }
  }
};
