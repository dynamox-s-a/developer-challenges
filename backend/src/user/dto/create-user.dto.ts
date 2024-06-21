import { 
    IsEmail, 
    IsString, 
    Matches, 
    MaxLength, 
    MinLength 
} from 'class-validator'

import { User } from '../entities/user.entity'

export class CreateUserDto extends User {
	@IsEmail()
	email: string

	@IsString()
	@MinLength(8)
	@MaxLength(20)
	@Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, { message: 'Senha muito fraca' })
	password: string

	@IsString()
	name: string
}
