import { Test, TestingModule } from '@nestjs/testing'
import { LoginController } from './login.controller'
import { LoginService } from './login.service'

describe('LoginController', () => {
  let controller: LoginController

  const mockCredentials = { email: 'user@email.com', userPassword: '12345' }

  const mockUserSession = { id: 'my-unique-id', name: 'name', email: 'email@email.com' }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoginController],
      providers: [
        {
          provide: LoginService,
          useValue: { authenticate: jest.fn().mockResolvedValue(mockUserSession) }
        }
      ]
    }).compile()

    controller = module.get<LoginController>(LoginController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should return a user session when login success', async () => {
    const response = await controller.login(mockCredentials)
    const expected = mockUserSession
    expect(response).toEqual(expected)
  })
})
