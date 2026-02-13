import mongoose from 'mongoose'
import '@/utils/env'

const dbConnect = async () => {
  const mongodbUri = process.env.NEXT_PUBLIC_MONGODB_URI
  if (!mongodbUri) throw new Error('Envs não carregadas')

  if (mongoose.connection.readyState >= 1) return
  try {
    await mongoose.connect(mongodbUri, {
      dbName: 'SensoryData',
    })
    console.log('MongoDB Connected')
  } catch (error) {
    console.error('MongoDB Connection Error:', error)
    process.exit(1)
  }
}
export default dbConnect
