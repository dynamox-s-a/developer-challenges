import { IsEmail, IsNotEmpty, IsString, IsUUID, MinLength } from "class-validator";

export class loginDTO {
    @IsEmail({}, { message: "E-mail is invalid" }) @IsNotEmpty() @IsString()
    email: string;

    @IsString() @IsNotEmpty() @MinLength(6, { message: "Password must have 6 characters!" })
    password: string;
}