import * as bcrypt from 'bcrypt'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'

import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { PrismaService } from '../prisma/prisma.service'
import { User } from './entities/user.entity'

@Injectable()
export class UserService {
	constructor(private readonly prisma: PrismaService) { }

	async create(createUserDto: CreateUserDto): Promise<User> {
		const data: Prisma.UserCreateInput = {
			...createUserDto,
			password: await bcrypt.hash(createUserDto.password, 10),
		}

		const createdUser = await this.prisma.user.create({ data })

		return {
			...createdUser,
			password: undefined,
		}
	}

	findById(id: string) {
		return this.prisma.user.findUnique({
			where: { id },
		})
	}

	findByEmail(email: string) {
		return this.prisma.user.findUnique({
			where: { email },
		})
	}
	

	//Future implementation
	findAll() {
		return `This action returns all users`
	}
	update(id: number, updateUserDto: UpdateUserDto) {
		return `This action updates a #${id} user`
	}
	remove(id: number) {
		return `This action removes a #${id} user`
	}
}
