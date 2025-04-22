import mongoose from 'mongoose';

export async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI as string, {
      dbName: 'Dynamox',
      ssl: true
    });
    console.log('🟢 Conecting to MongoDB Atlas');
  } catch (error) {
    console.error('🔴 MongoDB connection error:', error);
    process.exit(1);
  }

  mongoose.connection.on('connected', () => {
    console.log('✅ MongoDB connected!');
  });
  mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err);
  });
}
