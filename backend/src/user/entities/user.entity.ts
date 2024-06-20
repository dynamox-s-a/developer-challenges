import { Prisma } from '@prisma/client'

export class User implements Prisma.UserUncheckedCreateInput {
	id: string
	email: string
	password: string
	userName: string
	createdAt: Date
	updatedAt: Date
}
