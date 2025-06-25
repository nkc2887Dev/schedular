import mongoose from 'mongoose';
import { config } from './processEnv';

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = config.MONGO.URL;
    await mongoose.connect(mongoURI);

    console.log('MongoDB connected successfully');

    // Handle connection events
    mongoose.connection.on('error', err => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};
