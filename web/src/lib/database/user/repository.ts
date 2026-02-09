import User, {
  type IUser,
  type UserDocument,
  type UserDTO,
} from '@/lib/database/user/schema'
import dbConnect from '@/lib/database/mongoose'
import bcrypt from 'bcrypt'
import { env } from '@/utils/env'

export class UserRepository {
  async create(user: UserDTO): Promise<IUser | null> {
    await dbConnect()

    const validateUser = await User.findOne({ email: user.email })
    if (validateUser) return null

    const hashedPassword = await bcrypt.hash(user.password, env.BCRYPT_PASS)

    const userData = {
      ...user,
      password: hashedPassword,
    }

    const newUser = new User(userData)
    const savedUser = await newUser.save()

    return savedUser.toObject() as IUser
  }

  async findByEmail(user: UserDTOLogin): Promise<IUser | null> {
    await dbConnect()
    const findUserByEmail = await User.findOne<UserDocument>({
      email: user.email,
    })

    if (!findUserByEmail) return null

    const isPasswordValid = await bcrypt.compare(
      user.password,
      findUserByEmail.password,
    )
    if (!isPasswordValid) return null

    return findUserByEmail.toObject() as IUser
  }
}

type UserDTOLogin = Omit<UserDTO, 'name'>
const userRepository = new UserRepository()
export default userRepository
