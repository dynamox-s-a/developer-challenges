import mongoose from 'mongoose'
import z from 'zod'

const UserModel = z.object({
  name: z.string().min(3).max(200),
  email: z.email().max(250),
  password: z.string().min(6).max(200),
})

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

export type UserDTO = z.infer<typeof UserModel>
export type UserDocument = mongoose.HydratedDocument<IUser>

export default User
