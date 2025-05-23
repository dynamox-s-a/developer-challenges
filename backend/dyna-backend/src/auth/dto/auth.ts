import { IsEmail, IsNotEmpty, Length } from "class-validator";

export class LoginDTO{    
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;
}

export class SignUpDTO{
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @Length(6,30)
    password: string;
    
    @IsEmail()
    email: string;
}