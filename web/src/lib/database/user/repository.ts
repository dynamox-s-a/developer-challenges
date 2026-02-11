import User, { type IUser, type UserDocument } from '@/lib/database/user/schema'
import type { CreateUserDto } from '@/types/zod/user'
import bcrypt from 'bcrypt'

export class UserRepository {
  async create(user: CreateUserDto): Promise<IUser | null> {
    const validateUser = await User.findOne({ email: user.email })
    if (validateUser) return null

    const hashedPassword = await bcrypt.hash(user.password, 10)

    const userData = {
      ...user,
      password: hashedPassword,
    }

    const newUser = new User(userData)
    const savedUser = await newUser.save()

    return savedUser.toObject() as IUser
  }

  async findByEmail(user: UserDTOLogin): Promise<IUser | null> {
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

type UserDTOLogin = Omit<CreateUserDto, 'name'>
const userRepository = new UserRepository()
export default userRepository
