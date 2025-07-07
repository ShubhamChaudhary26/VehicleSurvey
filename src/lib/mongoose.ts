import mongoose from 'mongoose';

export async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) {
    console.log('Already connected to MongoDB');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI as string, {
      dbName: 'nps', 
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Failed to connect to MongoDB');
  }
}