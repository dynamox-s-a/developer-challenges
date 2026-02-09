import { env } from '@/utils/env'
import mongoose from 'mongoose'

const dbConnect = async () => {
  if (mongoose.connection.readyState >= 1) return
  try {
    await mongoose.connect(env.MONGODB_URI, { dbName: 'SensoryData' })
    console.log('MongoDB Connected')
  } catch (error) {
    console.error('MongoDB Connection Error:', error)
    process.exit(1)
  }
}
export default dbConnect
