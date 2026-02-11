import mongoose from 'mongoose'

export interface IUser extends mongoose.Document {
  name: string
  email: string
  password: string
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    name: String,
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true },
)

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
export type UserDocument = mongoose.HydratedDocument<IUser>
export default User
