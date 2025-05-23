import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDTO, SignUpDTO } from './dto/auth';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService, private jwtService: JwtService) { }

  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  async login(data: LoginDTO) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: data.email,
      },
    })

    if (!user) {
      throw new UnauthorizedException('Dados invalidos!');
    }

    const passCompare = await bcrypt.compare(data.password, user.password);

    if (!passCompare) {
      throw new UnauthorizedException('Dados invalidos!');
    }

    const acessToken = await this.jwtService.signAsync({
      id: user.id,
      name: user.name,
      email: user.email
    })


    return {      
      "Login for: ": user.name,
      "Token": acessToken
    };
      
  }

  async signup(data: SignUpDTO) {
    const userAlreadyExists = await this.prismaService.user.findUnique({
      where: {
        email: data.email,
      },
    })

    if (userAlreadyExists) {
      throw new UnauthorizedException('Usuário já exista na base de dados');
    }

    const passCrypt = await bcrypt.hash(data.password, 10);

    const user = await this.prismaService.user.create({
      data: {
        ...data,
        password: passCrypt,
      }
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
