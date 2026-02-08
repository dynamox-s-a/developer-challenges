import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true },
)

export default mongoose.models.User || mongoose.model('User', UserSchema)
