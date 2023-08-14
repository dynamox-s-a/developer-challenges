import { Test, TestingModule } from '@nestjs/testing'
import { MachineController } from './machine.controller'
import { MachineService } from './machine.service'

describe('MachineController', () => {
  let controller: MachineController
  let service: MachineService
  const mockMachine = [
    {
      id: 'cll5luz8p0000veihrodwvomu',
      name: 'machine 001',
      type: 'Pump'
    }
  ]

  const mockNewMachine = { name: 'machine 001', type: 'Pump' }

  const mockUpdatedMachine = {
    name: 'updated machine',
    type: 'Fan'
  }

  const mockMachineService = {
    findAll: jest.fn().mockResolvedValue(mockMachine),
    create: jest.fn().mockResolvedValue({ ...mockNewMachine, id: 'my-unique-id' }),
    findOne: jest.fn().mockResolvedValue(mockMachine[0]),
    update: jest.fn().mockResolvedValue({ ...mockUpdatedMachine, id: 'my-unique-id' }),
    remove: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MachineController],
      providers: [{ provide: MachineService, useValue: mockMachineService }]
    }).compile()
    controller = module.get<MachineController>(MachineController)
    service = module.get<MachineService>(MachineService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should create a new machine', async () => {
    const response = await controller.create(mockNewMachine)
    const expected = { ...mockNewMachine, id: 'my-unique-id' }
    expect(response).toEqual(expected)
  })

  it('should return all machines', async () => {
    const response = await controller.findAll()
    const expected = mockMachine
    expect(response).toEqual(expected)
  })

  it('should return a machine by id', async () => {
    const response = await controller.findOne('cll5luz8p0000veihrodwvomu')
    const expected = mockMachine[0]
    expect(response).toEqual(expected)
  })

  it('should update a machine by id', async () => {
    const response = await controller.update('my-unique-id', mockUpdatedMachine)
    const expected = { id: 'my-unique-id', ...mockUpdatedMachine }
    expect(response).toEqual(expected)
  })

  it('should remove a machine by id', async () => {
    await controller.remove('my-unique-id')
    expect(service.remove).toHaveBeenCalledWith('my-unique-id')
  })
})
