import { Test, TestingModule } from '@nestjs/testing'
import { LoginService } from './login.service'
import { PrismaService } from '../prisma/prisma.service'
import { UnauthorizedException } from '@nestjs/common'

describe('LoginService', () => {
  let service: LoginService
  let prisma: PrismaService

  const mockCredentials = { email: 'teste@dynamox.net', userPassword: 'dynamox' }

  const mockUserSession = {
    id: 'my-unique-id',
    name: 'name',
    email: 'teste@dynamox.net',
    password: '$2b$10$Y1JTE4Clbs7ouy6xjl6KneTq3YnPNXclqP7nYv0oJCA8g.FNByI.S'
  }

  const mockPrismaService = {
    user: {
      findUniqueOrThrow: jest.fn().mockResolvedValue(mockUserSession)
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoginService, { provide: PrismaService, useValue: mockPrismaService }]
    }).compile()
    prisma = module.get<PrismaService>(PrismaService)
    service = module.get<LoginService>(LoginService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should throw UnauthorizedException on authenticate when provide wrong email', async () => {
    const authenticateMock = jest
      .spyOn(prisma.user, 'findUniqueOrThrow')
      .mockRejectedValueOnce(new UnauthorizedException('Error: Access Denied'))

    expect.assertions(2)
    try {
      await service.authenticate({ email: 'asd@dynamox.net', userPassword: 'dynamox' })
    } catch (error) {
      expect(error.message).toMatch('Error: Access Denied')
    }
    expect(authenticateMock).toHaveBeenCalledWith({
      where: { email: 'asd@dynamox.net' }
    })
  })

  it('should throw UnauthorizedException on authenticate when provide wrong password ', async () => {
    const authenticateMock = jest
      .spyOn(prisma.user, 'findUniqueOrThrow')
      .mockResolvedValueOnce(mockUserSession)

    expect.assertions(2)
    try {
      await service.authenticate({ email: 'teste@dynamox.net', userPassword: 'wrong' })
    } catch (error) {
      expect(error.message).toMatch('Error: Access Denied')
    }
    expect(authenticateMock).toHaveBeenCalledWith({
      where: { email: 'teste@dynamox.net' }
    })
  })

  it('should return a user session when login', async () => {
    const response = await service.authenticate(mockCredentials)
    const { password, ...session } = mockUserSession
    const expected = session
    expect(prisma.user.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { email: mockCredentials.email }
    })
    expect(response).toEqual(expected)
  })
})
