import { Test, TestingModule } from '@nestjs/testing'
import { MachineService } from './machine.service'
import { PrismaService } from '../prisma/prisma.service'
import { Prisma } from '@prisma/client'

describe('MachineService', () => {
  let service: MachineService
  let prisma: PrismaService

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

  const mockPrismaService = {
    machine: {
      create: jest.fn().mockReturnValue({ ...mockNewMachine, id: 'my-unique-id' }),
      findMany: jest.fn().mockResolvedValue(mockMachine),
      findFirst: jest.fn().mockResolvedValue(mockMachine[0]),
      update: jest.fn().mockResolvedValue({ id: 'my-unique-id', ...mockUpdatedMachine }),
      delete: jest.fn()
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MachineService, { provide: PrismaService, useValue: mockPrismaService }]
    }).compile()
    prisma = module.get<PrismaService>(PrismaService)
    service = module.get<MachineService>(MachineService)
  })

  it('should handle unique constraint violation on create when machine already exist', async () => {
    const createMock = jest.spyOn(prisma.machine, 'create').mockRejectedValueOnce(
      new Prisma.PrismaClientKnownRequestError('P2002', {
        code: 'P2002',
        clientVersion: ''
      })
    )

    expect.assertions(2)
    try {
      await service.create(mockNewMachine)
    } catch (e) {
      expect(e.response.message).toMatch('Error: Machine already exists. Try another name.')
    }

    expect(createMock).toHaveBeenCalledWith({
      data: mockNewMachine
    })
  })

  it('should handle other Prisma errors on create', async () => {
    const createMock = jest.spyOn(prisma.machine, 'create').mockRejectedValueOnce(
      new Prisma.PrismaClientKnownRequestError('SOME_OTHER_ERROR', {
        code: 'P9999',
        clientVersion: ''
      })
    )

    expect.assertions(2)
    try {
      await service.create(mockNewMachine)
    } catch (e) {
      expect(e.message).toMatch('SOME_OTHER_ERROR')
    }

    expect(createMock).toHaveBeenCalledWith({
      data: mockNewMachine
    })
  })

  it('should create a new machine', async () => {
    const response = await service.create(mockNewMachine)
    const expected = { ...mockNewMachine, id: 'my-unique-id' }
    expect(prisma.machine.create).toHaveBeenCalledWith({
      data: { name: mockNewMachine.name, type: mockNewMachine.type }
    })
    expect(response).toEqual(expected)
  })

  it('should return all machines', async () => {
    const response = await service.findAll()
    const expected = mockMachine
    expect(prisma.machine.findMany).toHaveBeenCalled()
    expect(response).toEqual(expected)
  })

  it('should return a machine by id', async () => {
    const response = await service.findOne('cll5luz8p0000veihrodwvomu')
    const expected = mockMachine[0]
    expect(prisma.machine.findFirst).toHaveBeenCalledWith({
      where: { id: 'cll5luz8p0000veihrodwvomu' }
    })
    expect(response).toEqual(expected)
  })

  it('should handle unique constraint violation on update when machine already exist', async () => {
    jest.spyOn(prisma.machine, 'update').mockRejectedValueOnce(
      new Prisma.PrismaClientKnownRequestError('P2002', {
        code: 'P2002',
        clientVersion: ''
      })
    )

    expect.assertions(2)
    try {
      await service.update('my-unique-id', { ...mockUpdatedMachine })
    } catch (e) {
      expect(e.response.message).toMatch('Error: Machine already exists. Try another name.')
    }
    expect(prisma.machine.update).toHaveBeenCalledWith({
      data: { name: mockUpdatedMachine.name, type: mockUpdatedMachine.type },
      where: { id: 'my-unique-id' }
    })
  })

  it('should handle other Prisma errors on update', async () => {
    jest.spyOn(prisma.machine, 'update').mockRejectedValueOnce(
      new Prisma.PrismaClientKnownRequestError('SOME_OTHER_ERROR', {
        code: 'P9999',
        clientVersion: ''
      })
    )

    expect.assertions(2)
    try {
      await service.update('my-unique-id', { ...mockUpdatedMachine })
    } catch (e) {
      expect(e.message).toMatch('SOME_OTHER_ERROR')
    }

    expect(prisma.machine.update).toHaveBeenCalled()
  })

  it('should update a machine by id', async () => {
    const response = await service.update('my-unique-id', { ...mockUpdatedMachine })
    const expected = { id: 'my-unique-id', ...mockUpdatedMachine }
    expect(prisma.machine.update).toHaveBeenCalledWith({
      data: { name: mockUpdatedMachine.name, type: mockUpdatedMachine.type },
      where: { id: 'my-unique-id' }
    })
    expect(response).toEqual(expected)
  })

  it('should remove a machine by id', async () => {
    await service.remove('my-unique-id')
    expect(prisma.machine.delete).toHaveBeenCalledWith({ where: { id: 'my-unique-id' } })
  })
})
