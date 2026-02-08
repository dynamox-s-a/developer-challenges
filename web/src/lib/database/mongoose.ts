import { env } from '@/utils/env'
import mongoose from 'mongoose'

export async function dbConnect() {
  if (!env.MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI enviroment variable')
  }

  await mongoose.connect(env.MONGODB_URI)
  return mongoose
}
